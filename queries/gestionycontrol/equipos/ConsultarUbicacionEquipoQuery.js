const { query } = require('../../../config/db');

/**
 * Consulta dónde se encuentra actualmente un equipo.
 *
 * Devuelve dos cosas:
 *   1. La ficha del equipo (identidad + cantidades).
 *   2. Las ubicaciones donde todavía hay unidades en obra.
 *
 * ── Cómo se decide que una unidad "está en obra" ──────────────────────────
 * NO se usa `equipo.IdEstado` ni `equipo.CantidadDisponible`: ese contador es
 * un agregado y no dice DÓNDE está cada unidad. La ubicación real se deduce
 * del movimiento documental, igual que hace el informe de estado de cuenta:
 *
 *     en obra = lo remisionado − lo devuelto      (por detalle de remisión)
 *
 * Sólo se cuentan las líneas con saldo positivo, así que una remisión
 * completamente devuelta desaparece del listado.
 *
 * ── Consistencia con "Estado de cuenta" ───────────────────────────────────
 * El cruce con devoluciones usa la MISMA tripleta que
 * `VerEstadoDeCuentaQuery` (IdRemision + IdEquipo + IdDetalleRemision) para
 * que ambas pantallas no puedan dar cifras distintas del mismo equipo. Ojo:
 * `detalles_devoluciones.IdDetalleRemision` admite NULL en registros
 * antiguos; existe la semilla
 * `Agregar_IdDetalleRemision_A_Detalles_Devoluciones_Existentes.js` que los
 * rellena. Si alguna devolución quedara sin ese dato, no se descontaría aquí
 * (ni en estado de cuenta).
 *
 * ── Zona horaria ──────────────────────────────────────────────────────────
 * El tiempo transcurrido se calcula contra la hora de Colombia
 * (`UTC_TIMESTAMP() - 5h`), no contra `NOW()`, que depende de la zona del
 * servidor MySQL. Es el mismo criterio del resto de informes.
 */

const SQL_FICHA_EQUIPO = `
    SELECT
        equi.IdEquipo,
        equi.Nombre                                  AS NombreEquipo,
        cate.Categoria                               AS Categoria,
        tipo_equi.TipoEquipo                         AS TipoDeEquipo,
        uni.Nombre                                   AS UnidadDeMedida,
        bode.NombreBodega                            AS Bodega,
        esta.Estado                                  AS Estado,
        COALESCE(equi.Cantidad, 0)                   AS CantidadTotal,
        COALESCE(equi.CantidadDisponible, 0)         AS CantidadDisponible,
        CASE
            WHEN COALESCE(equi.DocumentoSubarrendatario, '0') IN ('0', 'ABC')
                THEN 'TECNISERVICIOS J.F S.A.S'
            ELSE CONCAT(
                SUBSTRING_INDEX(COALESCE(usu_sub.Nombres, ''), ' ', 1), ' ',
                SUBSTRING_INDEX(COALESCE(usu_sub.Apellidos, ''), ' ', 1)
            )
        END                                          AS Propietario
    FROM equipo AS equi
    INNER JOIN categorias  AS cate      ON equi.IdCategoria      = cate.IdCategoria
    INNER JOIN estado      AS esta      ON equi.IdEstado         = esta.IdEstado
    INNER JOIN tipo_equipo AS tipo_equi ON equi.IdTipoEquipo     = tipo_equi.IdTipoEquipo
    INNER JOIN unidad      AS uni       ON equi.IdUnidadDeMedida = uni.IdUnidad
    INNER JOIN bodegas     AS bode      ON equi.IdBodega         = bode.IdBodega
    LEFT  JOIN usuario     AS usu_sub   ON equi.DocumentoSubarrendatario = usu_sub.DocumentoUsuario
    WHERE equi.IdEquipo = ?
`;

const SQL_UBICACIONES = `
    SELECT
        dr.IdDetalleRemision,
        r.IdRemision,
        r.NoRemision,

        -- Cliente que tiene el equipo
        r.DocumentoCliente,
        TRIM(CONCAT(COALESCE(cli.Nombres, ''), ' ', COALESCE(cli.Apellidos, ''))) AS Cliente,
        cli.Telefono        AS TelefonoCliente,
        cli.Celular1        AS CelularCliente,

        -- Proyecto y su ubicación física
        p.IdProyecto,
        p.Nombre            AS Proyecto,
        p.Direccion         AS DireccionProyecto,

        -- Desde cuándo está allí
        r.FechaRemision,
        DATE_FORMAT(r.FechaRemision, '%d/%m/%Y')            AS FechaRemisionTexto,
        DATE_FORMAT(r.FechaRemision, '%d/%m/%Y a las %l:%i %p') AS FechaRemisionCompleta,
        TIMESTAMPDIFF(DAY, r.FechaRemision, DATE_ADD(UTC_TIMESTAMP(), INTERVAL -5 HOUR)) AS DiasEnObra,

        -- Saldo de unidades.
        -- El CAST no es cosmetico: SUM() devuelve DECIMAL y el driver mysql2 lo
        -- entrega como STRING. Sin castear, el JSON traeria "1" en vez de 1 y
        -- cualquier suma en el cliente concatenaria en lugar de sumar.
        dr.Cantidad                                                            AS CantidadPrestada,
        CAST(COALESCE(devueltos.CantidadDevuelta, 0) AS SIGNED)                AS CantidadDevuelta,
        CAST(dr.Cantidad - COALESCE(devueltos.CantidadDevuelta, 0) AS SIGNED)  AS CantidadEnObra,
        devueltos.UltimaFechaDevolucion               AS FechaUltimaDevolucion

    FROM remisiones AS r
    INNER JOIN detalles_remisiones AS dr ON r.IdRemision = dr.IdRemision
    INNER JOIN usuario   AS cli ON r.DocumentoCliente = cli.DocumentoUsuario
    INNER JOIN proyectos AS p   ON r.IdProyecto       = p.IdProyecto

    LEFT JOIN (
        SELECT
            dd.IdRemision,
            dd.IdEquipo,
            dd.IdDetalleRemision,
            SUM(dd.Cantidad)        AS CantidadDevuelta,
            MAX(d.FechaDevolucion)  AS UltimaFechaDevolucion
        FROM detalles_devoluciones AS dd
        INNER JOIN devoluciones AS d ON dd.IdDevolucion = d.IdDevolucion
        WHERE d.IdEstado IN (
            SELECT IdEstado FROM estado
            WHERE Estado NOT LIKE '%Anulado%' AND Estado NOT LIKE '%Cancelado%'
        )
        GROUP BY dd.IdRemision, dd.IdEquipo, dd.IdDetalleRemision
    ) AS devueltos
        ON  devueltos.IdRemision        = r.IdRemision
        AND devueltos.IdEquipo          = dr.IdEquipo
        AND devueltos.IdDetalleRemision = dr.IdDetalleRemision

    WHERE dr.IdEquipo = ?
      AND r.IdEstado IN (
          SELECT IdEstado FROM estado
          WHERE Estado NOT LIKE '%Anulado%' AND Estado NOT LIKE '%Cancelado%'
      )

    HAVING CantidadEnObra > 0
    ORDER BY r.FechaRemision ASC
`;

const ConsultarUbicacionEquipoQuery = async (IdEquipo) => {
    await query(`SET lc_time_names = 'es_ES';`);

    const [ficha] = await query(SQL_FICHA_EQUIPO, [IdEquipo]);
    if (!ficha) return null;

    const Ubicaciones = await query(SQL_UBICACIONES, [IdEquipo]);

    // El total en obra se recalcula sumando las ubicaciones en vez de leer
    // `CantidadDisponible`: ese campo sólo se descuenta para los equipos de la
    // empresa anfitriona (ver `CrearRemisionQuery`), así que para un equipo de
    // subarrendatario no reflejaría la realidad.
    const CantidadEnObra = Ubicaciones.reduce((suma, u) => suma + Number(u.CantidadEnObra || 0), 0);

    return {
        Equipo: { ...ficha, CantidadEnObra },
        Ubicaciones
    };
};

module.exports = {
    ConsultarUbicacionEquipoQuery
};
