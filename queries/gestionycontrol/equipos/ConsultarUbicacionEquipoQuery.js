const { query } = require('../../../config/db');
const { EmpresaAnfitriona } = require('../../../utils/constant/default');

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
 * ── Propio vs. subarriendo ─────────────────────────────────────────────────
 * Cada línea de remisión dice de quién son sus unidades en
 * `detalles_remisiones.DocumentoSubarrendatario`: vacío, '0', 'ABC' o el NIT de
 * la empresa anfitriona = PROPIAS; cualquier otro documento = tomadas en
 * SUBARRIENDO a ese tercero. Al remisionar sólo se descuenta del inventario lo
 * propio (`CrearRemisionQuery`), por eso Total y Disponible de la ficha son
 * cifras propias y "en obra" se desglosa en ambos orígenes: sin el desglose,
 * "en obra" podía superar al total y no cuadraba.
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
        devueltos.UltimaFechaDevolucion               AS FechaUltimaDevolucion,

        -- Origen de las unidades de esta línea (ver cabecera)
        CASE
            WHEN COALESCE(dr.DocumentoSubarrendatario, '0') IN ('0', 'ABC', ?) THEN 1
            ELSE 0
        END                                           AS EsPropio,
        CASE
            WHEN COALESCE(dr.DocumentoSubarrendatario, '0') IN ('0', 'ABC', ?) THEN NULL
            ELSE dr.DocumentoSubarrendatario
        END                                           AS DocumentoSubarrendatario,
        CASE
            WHEN COALESCE(dr.DocumentoSubarrendatario, '0') IN ('0', 'ABC', ?) THEN NULL
            ELSE COALESCE(
                NULLIF(TRIM(CONCAT(COALESCE(sub.Nombres, ''), ' ', COALESCE(sub.Apellidos, ''))), ''),
                dr.DocumentoSubarrendatario
            )
        END                                           AS Subarrendatario,
        COALESCE(sub.Celular1, sub.Telefono)          AS ContactoSubarrendatario

    FROM remisiones AS r
    INNER JOIN detalles_remisiones AS dr ON r.IdRemision = dr.IdRemision
    INNER JOIN usuario   AS cli ON r.DocumentoCliente = cli.DocumentoUsuario
    INNER JOIN proyectos AS p   ON r.IdProyecto       = p.IdProyecto
    LEFT  JOIN usuario   AS sub ON dr.DocumentoSubarrendatario = sub.DocumentoUsuario

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

    const Anfitriona = EmpresaAnfitriona.value;
    const filas = await query(SQL_UBICACIONES, [Anfitriona, Anfitriona, Anfitriona, IdEquipo]);
    const Ubicaciones = filas.map((u) => ({ ...u, EsPropio: Number(u.EsPropio) === 1 }));

    // El total en obra se recalcula sumando las ubicaciones en vez de leer
    // `CantidadDisponible`: ese campo sólo se descuenta para los equipos de la
    // empresa anfitriona (ver `CrearRemisionQuery`), así que para un equipo de
    // subarrendatario no reflejaría la realidad.
    let CantidadEnObraPropia = 0;
    let CantidadEnObraSubarrendada = 0;
    const porSubarrendatario = new Map();

    for (const u of Ubicaciones) {
        const cantidad = Number(u.CantidadEnObra || 0);
        if (u.EsPropio) {
            CantidadEnObraPropia += cantidad;
            continue;
        }
        CantidadEnObraSubarrendada += cantidad;
        const previo = porSubarrendatario.get(u.DocumentoSubarrendatario);
        if (previo) {
            previo.CantidadEnObra += cantidad;
        } else {
            porSubarrendatario.set(u.DocumentoSubarrendatario, {
                Documento: u.DocumentoSubarrendatario,
                Nombre: u.Subarrendatario,
                Contacto: u.ContactoSubarrendatario,
                CantidadEnObra: cantidad,
            });
        }
    }

    return {
        Equipo: {
            ...ficha,
            CantidadEnObra: CantidadEnObraPropia + CantidadEnObraSubarrendada,
            CantidadEnObraPropia,
            CantidadEnObraSubarrendada,
            // De mayor a menor cantidad en obra
            Subarrendatarios: [...porSubarrendatario.values()].sort((a, b) => b.CantidadEnObra - a.CantidadEnObra),
        },
        Ubicaciones
    };
};

module.exports = {
    ConsultarUbicacionEquipoQuery
};
