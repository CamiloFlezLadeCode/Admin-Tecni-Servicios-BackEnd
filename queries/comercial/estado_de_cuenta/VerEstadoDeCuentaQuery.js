const { query } = require('../../../config/db');

const VerEstadoDeCuentaQuery = async (DocumentoCliente) => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);

    const sql = `
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
    --DATE_FORMAT(r.FechaRemision, '%d/%m/%Y %H:%i') AS FechaRemision,
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
    devueltos.UltimaFechaDevolucion AS FechaUltimaDevolucion,
    
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
        SUM(dd.Cantidad) AS CantidadDevuelta,
        MAX(d.FechaDevolucion) AS UltimaFechaDevolucion,
        MAX(d.NoDevolucion) AS NoDevolucion
    FROM detalles_devoluciones dd
    INNER JOIN devoluciones d ON dd.IdDevolucion = d.IdDevolucion
    WHERE d.IdEstado IN (SELECT IdEstado FROM estado WHERE Estado NOT LIKE '%Anulado%' AND Estado NOT LIKE '%Cancelado%')
    GROUP BY dd.IdEquipo, dd.IdRemision
) devueltos ON devueltos.IdRemision = r.IdRemision AND devueltos.IdEquipo = dr.IdEquipo

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

ORDER BY 
    r.DocumentoCliente, 
    r.FechaRemision DESC,
    EstadoDevolucion DESC,
    CantidadPendiente DESC;
    `;
    return query(sql, [DocumentoCliente]);
};
module.exports = {
    VerEstadoDeCuentaQuery
};