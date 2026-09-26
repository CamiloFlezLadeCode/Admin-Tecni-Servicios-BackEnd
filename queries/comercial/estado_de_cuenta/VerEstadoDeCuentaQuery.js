const { query } = require('../../../config/db');
const { consultaPaginada, condicionIgual } = require('../../../utils/paginacion');

// Consulta del estado de cuenta, separada de su orden para reutilizarla en la versión paginada.
// Termina en su propio HAVING: la versión paginada le añade condiciones con AND.
const SQL_ESTADO_DE_CUENTA = `
        SELECT 
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
        dr.PrecioUnidad AS PrecioUnitario,
        
        -- Estado de Devolución
        COALESCE(devueltos.CantidadDevuelta, 0) AS CantidadDevuelta,
        (dr.Cantidad - COALESCE(devueltos.CantidadDevuelta, 0)) AS CantidadPendiente,
        
        -- Cálculo de Tiempo
        CASE 
            WHEN (dr.Cantidad - COALESCE(devueltos.CantidadDevuelta, 0)) = 0 AND devueltos.UltimaFechaDevolucion IS NOT NULL THEN
                CONCAT(
                    FLOOR(TIMESTAMPDIFF(HOUR, r.FechaRemision, devueltos.UltimaFechaDevolucion) / 24), ' días ',
                    MOD(TIMESTAMPDIFF(HOUR, r.FechaRemision, devueltos.UltimaFechaDevolucion), 24), ' horas'
                )
            ELSE
                CONCAT(
                    FLOOR(TIMESTAMPDIFF(HOUR, r.FechaRemision, DATE_ADD(UTC_TIMESTAMP(), INTERVAL -5 HOUR)) / 24), ' días ',
                    MOD(TIMESTAMPDIFF(HOUR, r.FechaRemision, DATE_ADD(UTC_TIMESTAMP(), INTERVAL -5 HOUR)), 24), ' horas'
                )
        END AS TiempoPrestamo,
        
        -- ✅ ESTADO CORREGIDO: Solo "Completo" o "Pendiente"
        CASE 
            WHEN (dr.Cantidad - COALESCE(devueltos.CantidadDevuelta, 0)) = 0 THEN 'Completo'
            ELSE 'Pendiente'
        END AS EstadoDevolucion,
        
        -- Cálculos Financieros
        dr.PrecioTotal AS ValorTotalRemision,
        (dr.Cantidad - COALESCE(devueltos.CantidadDevuelta, 0)) * dr.PrecioUnidad AS ValorPendiente,
        
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
                    COALESCE(SUM(ValorPendiente), 0)   AS valorPendiente
                FROM (
${filtradoSinBusqueda.sql}
) AS resumen`,
                filtradoSinBusqueda.params
            );
            return {
                Opciones: {
                    Proyectos: proyectos.map((f) => f.Proyecto),
                    Equipos: equipos.map((f) => f.Equipo),
                },
                Resumen: {
                    totalPrestado: Number(resumen.totalPrestado),
                    totalDevuelto: Number(resumen.totalDevuelto),
                    totalPendiente: Number(resumen.totalPendiente),
                    valorPendiente: Number(resumen.valorPendiente),
                },
            };
        },
    });
};

module.exports = {
    VerEstadoDeCuentaQuery,
    VerEstadoDeCuentaPaginadoQuery
};