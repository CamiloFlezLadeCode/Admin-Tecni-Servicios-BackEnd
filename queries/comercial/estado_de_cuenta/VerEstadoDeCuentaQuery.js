const { query } = require('../../../config/db');
const { consultaPaginada, condicionIgual } = require('../../../utils/paginacion');
const {
    SQL_AHORA_COLOMBIA,
    SQL_ESTADOS_VIGENTES,
    sqlDiasCobrados,
    sqlUnidadesDia,
    sqlFactorIVA,
} = require('../../../utils/cobroAlquiler');

// Horas reales del préstamo: hasta la última devolución si ya se devolvió todo, si no hasta hoy.
// Nunca negativas: hay devoluciones registradas el mismo día con una hora anterior a la de la
// remisión (p. ej. 1643), y restarlas tal cual mostraba "-1 días -4 horas".
const SQL_HORAS_PRESTAMO = `GREATEST(0, TIMESTAMPDIFF(HOUR, r.FechaRemision,
            CASE
                WHEN (dr.Cantidad - COALESCE(devueltos.CantidadDevuelta, 0)) = 0 AND devueltos.UltimaFechaDevolucion IS NOT NULL
                    THEN devueltos.UltimaFechaDevolucion
                ELSE ${SQL_AHORA_COLOMBIA}
            END))`;

// Consulta del estado de cuenta, separada de su orden para reutilizarla en la versión paginada.
// Termina en su propio HAVING: la versión paginada le añade condiciones con AND.
const SQL_ESTADO_DE_CUENTA = `
        SELECT 
        dr.IdDetalleRemision,
        -- Información del Cliente
        r.DocumentoCliente,
        CONCAT(
            SUBSTRING_INDEX(COALESCE(cliente.Nombres, ''), ' ', 1), 
            ' ', 
            SUBSTRING_INDEX(COALESCE(cliente.Apellidos, ''), ' ', 1)
        ) AS Cliente,
        
        -- Información de la Remisión
        r.NoRemision,
        -- DATE_FORMAT(r.FechaRemision, '%d/%m/%Y %H:%i') AS FechaRemision,
        -- (Ojo: en MySQL el doble guion sólo es comentario si le sigue un espacio. Sin él, esta línea
        -- se evaluaba como doble negación y generaba una columna FechaRemision duplicada.)
        DATE_FORMAT(r.FechaRemision, '%d/%m/%Y a las %l:%i %p') AS FechaRemision,
        
        -- Información del Proyecto
        p.Nombre AS Proyecto,
        
        -- Información del Equipo
        c.Categoria,
        e.Nombre AS Equipo,
        dr.Cantidad AS CantidadPrestada,
        
        -- Estado de Devolución
        COALESCE(devueltos.CantidadDevuelta, 0) AS CantidadDevuelta,
        (dr.Cantidad - COALESCE(devueltos.CantidadDevuelta, 0)) AS CantidadPendiente,
        
        -- Tiempo real transcurrido (informativo). Lo que se cobra son los días de más abajo.
        CONCAT(FLOOR(${SQL_HORAS_PRESTAMO} / 24), ' días ', MOD(${SQL_HORAS_PRESTAMO}, 24), ' horas') AS TiempoPrestamo,
        
        -- ✅ ESTADO CORREGIDO: Solo "Completo" o "Pendiente"
        CASE 
            WHEN (dr.Cantidad - COALESCE(devueltos.CantidadDevuelta, 0)) = 0 THEN 'Completo'
            ELSE 'Pendiente'
        END AS EstadoDevolucion,
        
        -- Cobro del alquiler (fórmula única en utils/cobroAlquiler.js, la misma de movimientos generales)
        dr.PrecioUnidad AS PrecioUnitario,
        COALESCE(r.IVA, 0) AS IVA,
        -- Días que se cobran por cada unidad aún en obra (NULL si ya no queda nada en obra)
        CASE WHEN (dr.Cantidad - COALESCE(devueltos.CantidadDevuelta, 0)) > 0
             THEN ${sqlDiasCobrados('r.FechaRemision', SQL_AHORA_COLOMBIA)} END AS DiasCobradosEnObra,
        ${sqlUnidadesDia('r', 'dr')} AS UnidadesDiaCobradas,
        dr.PrecioUnidad * ${sqlUnidadesDia('r', 'dr')} AS ValorAlquiler,
        dr.PrecioUnidad * ${sqlUnidadesDia('r', 'dr')} * ${sqlFactorIVA('r')} AS ValorAlquilerConIVA,
        -- Lo que el renglón sigue sumando por cada día más en obra, con IVA
        (dr.Cantidad - COALESCE(devueltos.CantidadDevuelta, 0)) * dr.PrecioUnidad * ${sqlFactorIVA('r')} AS CausacionDiariaConIVA,

        -- Cada devolución de este renglón: en qué documento, cuándo, cuántas unidades y días cobrados
        (
            SELECT JSON_ARRAYAGG(JSON_OBJECT(
                'NoDevolucion', dv.NoDevolucion,
                'Fecha', DATE_FORMAT(dv.FechaDevolucion, '%d/%m/%Y a las %l:%i %p'),
                'FechaOrden', DATE_FORMAT(dv.FechaDevolucion, '%Y-%m-%d %H:%i:%s'),
                'Cantidad', ddv.Cantidad,
                'DiasCobrados', ${sqlDiasCobrados('r.FechaRemision', 'dv.FechaDevolucion')},
                'AnteriorARemision', dv.FechaDevolucion < r.FechaRemision
            ))
            FROM detalles_devoluciones ddv
            INNER JOIN devoluciones dv ON ddv.IdDevolucion = dv.IdDevolucion
            WHERE ddv.IdDetalleRemision = dr.IdDetalleRemision
              AND dv.IdEstado IN ${SQL_ESTADOS_VIGENTES}
        ) AS Devoluciones,
        
        -- Información de Devolución (si existe)
        devueltos.NoDevolucion AS UltimaDevolucion,
        DATE_FORMAT(devueltos.UltimaFechaDevolucion, '%d/%m/%Y a las %l:%i %p') AS FechaUltimaDevolucion,
        
        -- Estado General de la Remisión
        es.Estado AS EstadoRemision

        FROM remisiones r
        INNER JOIN detalles_remisiones dr ON r.IdRemision = dr.IdRemision
        INNER JOIN usuario cliente ON r.DocumentoCliente = cliente.DocumentoUsuario
        INNER JOIN proyectos p ON r.IdProyecto = p.IdProyecto
        INNER JOIN categorias c ON dr.IdCategoria = c.IdCategoria
        INNER JOIN equipo e ON dr.IdEquipo = e.IdEquipo
        INNER JOIN estado es ON r.IdEstado = es.IdEstado

        -- Subconsulta optimizada para devoluciones
        LEFT JOIN (
            SELECT 
                dd.IdEquipo,
                dd.IdRemision,
                dd.IdDetalleRemision,
                SUM(dd.Cantidad) AS CantidadDevuelta,
                MAX(d.FechaDevolucion) AS UltimaFechaDevolucion,
                MAX(d.NoDevolucion) AS NoDevolucion
            FROM detalles_devoluciones dd
            INNER JOIN devoluciones d ON dd.IdDevolucion = d.IdDevolucion
            WHERE d.IdEstado IN (SELECT IdEstado FROM estado WHERE Estado NOT LIKE '%Anulado%' AND Estado NOT LIKE '%Cancelado%')
            GROUP BY dd.IdEquipo, dd.IdRemision, dd.IdDetalleRemision
        ) devueltos ON devueltos.IdRemision = r.IdRemision AND devueltos.IdEquipo = dr.IdEquipo AND devueltos.IdDetalleRemision = dr.IdDetalleRemision

        WHERE r.DocumentoCliente = ?  -- Parámetro para cliente específico
            AND r.IdEstado IN (
                SELECT IdEstado FROM estado 
                WHERE Estado NOT LIKE '%Anulado%' 
                AND Estado NOT LIKE '%Cancelado%'
            )

        GROUP BY 
            r.IdRemision, dr.IdDetalleRemision,
            r.DocumentoCliente, r.NoRemision, r.FechaRemision, p.Nombre,
            c.Categoria, e.Nombre, dr.Cantidad, dr.PrecioUnidad, dr.PrecioTotal,
            devueltos.CantidadDevuelta, es.Estado, dr.IdDetalleRemision,
            devueltos.UltimaFechaDevolucion, devueltos.NoDevolucion

        HAVING CantidadPendiente >= 0  -- Excluir casos con devoluciones mayores al préstamo
`;

const ORDEN_ESTADO_DE_CUENTA = `r.DocumentoCliente, r.FechaRemision DESC, EstadoDevolucion DESC, CantidadPendiente DESC`;

const VerEstadoDeCuentaQuery = async (DocumentoCliente) => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    return query(`${SQL_ESTADO_DE_CUENTA}
        ORDER BY ${ORDEN_ESTADO_DE_CUENTA}`, [DocumentoCliente]);
};
/**
 * Versión paginada del estado de cuenta de un cliente (ver `utils/paginacion.js`).
 *
 * Además de la página devuelve, calculado sobre el conjunto completo del cliente:
 *   · Opciones → proyectos y equipos distintos (alimentan los selects de filtro).
 *   · Resumen  → totales de las tarjetas, con los filtros de proyecto/equipo pero SIN
 *                la búsqueda de texto, igual que se calculaban antes en el cliente.
 */
const VerEstadoDeCuentaPaginadoQuery = async (DocumentoCliente, paginacion, filtros = {}) => {
    return consultaPaginada({
        sqlBase: SQL_ESTADO_DE_CUENTA,
        params: [DocumentoCliente],
        modo: 'having-existente',
        orden: `${ORDEN_ESTADO_DE_CUENTA}, dr.IdDetalleRemision DESC`,
        columnasBusqueda: [
            'NoRemision', 'Proyecto', 'Categoria', 'Equipo', 'EstadoDevolucion',
            // `r.FechaRemision` está en el GROUP BY: en HAVING el nombre sería la fecha cruda
            { expresion: "DATE_FORMAT(r.FechaRemision, '%d/%m/%Y a las %l:%i %p')" },
        ],
        paginacion,
        filtros: [condicionIgual('Proyecto', filtros.Proyecto), condicionIgual('Equipo', filtros.Equipo)],
        extras: async (conexion, { base, filtradoSinBusqueda }) => {
            const [proyectos] = await conexion.query(
                `SELECT DISTINCT Proyecto FROM (
${base.sql}
) AS opciones WHERE Proyecto IS NOT NULL AND Proyecto <> '' ORDER BY Proyecto`,
                base.params
            );
            const [equipos] = await conexion.query(
                `SELECT DISTINCT Equipo FROM (
${base.sql}
) AS opciones WHERE Equipo IS NOT NULL AND Equipo <> '' ORDER BY Equipo`,
                base.params
            );
            const [[resumen]] = await conexion.query(
                `SELECT
                    COALESCE(SUM(CantidadPrestada), 0) AS totalPrestado,
                    COALESCE(SUM(CantidadDevuelta), 0) AS totalDevuelto,
                    COALESCE(SUM(CantidadPendiente), 0) AS totalPendiente,
                    COALESCE(SUM(ValorAlquiler), 0) AS alquilerSinIVA,
                    COALESCE(SUM(ValorAlquilerConIVA), 0) AS alquilerConIVA,
                    COALESCE(SUM(CausacionDiariaConIVA), 0) AS causacionDiariaConIVA
                FROM (
${filtradoSinBusqueda.sql}
) AS resumen`,
                filtradoSinBusqueda.params
            );
            // El transporte es por documento (remisión/devolución), no por equipo: con el
            // filtro de equipo no se puede repartir y se informa como no aplicable (null).
            let transportes = null;
            if (!filtros.Equipo) {
                const porProyecto = filtros.Proyecto ? ' AND p.Nombre = ?' : '';
                const paramsTransporte = filtros.Proyecto ? [DocumentoCliente, filtros.Proyecto] : [DocumentoCliente];
                const [[tr]] = await conexion.query(
                    `SELECT
                        (SELECT COALESCE(SUM(r.ValorTransporte), 0) FROM remisiones r LEFT JOIN proyectos p ON p.IdProyecto = r.IdProyecto
                          WHERE r.DocumentoCliente = ? AND r.IdEstado IN ${SQL_ESTADOS_VIGENTES}${porProyecto}) AS remisiones,
                        (SELECT COALESCE(SUM(d.ValorTransporte), 0) FROM devoluciones d LEFT JOIN proyectos p ON p.IdProyecto = d.IdProyecto
                          WHERE d.DocumentoCliente = ? AND d.IdEstado IN ${SQL_ESTADOS_VIGENTES}${porProyecto}) AS devoluciones`,
                    [...paramsTransporte, ...paramsTransporte]
                );
                transportes = { remisiones: Number(tr.remisiones), devoluciones: Number(tr.devoluciones) };
            }
            const redondear = (n) => Math.round(Number(n) * 100) / 100;
            const alquilerConIVA = redondear(resumen.alquilerConIVA);
            return {
                Opciones: {
                    Proyectos: proyectos.map((f) => f.Proyecto),
                    Equipos: equipos.map((f) => f.Equipo),
                },
                Resumen: {
                    totalPrestado: Number(resumen.totalPrestado),
                    totalDevuelto: Number(resumen.totalDevuelto),
                    totalPendiente: Number(resumen.totalPendiente),
                    alquilerSinIVA: redondear(resumen.alquilerSinIVA),
                    alquilerConIVA,
                    causacionDiariaConIVA: redondear(resumen.causacionDiariaConIVA),
                    transportes,
                    // Total causado = alquiler con IVA + transportes (sin IVA). Sin transportes
                    // (filtro de equipo) el total es sólo el alquiler.
                    totalCausado: redondear(alquilerConIVA + (transportes ? transportes.remisiones + transportes.devoluciones : 0)),
                },
            };
        },
    });
};

module.exports = {
    VerEstadoDeCuentaQuery,
    VerEstadoDeCuentaPaginadoQuery
};