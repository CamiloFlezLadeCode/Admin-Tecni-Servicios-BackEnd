const { query } = require('../../../config/db');

const VerEstadoDeCuentaQuery = async (DocumentoCliente) => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    const sqsdfsdfl = `
        SELECT 
            r.DocumentoCliente,
            r.NoRemision AS 'Número de Remision',
            r.FechaCreacion AS 'Fecha Remision',
            p.Nombre AS 'Proyecto',
            c.Categoria AS 'Categoria Equipo',
            e.Nombre AS 'Equipo',
            dr.Cantidad AS 'Cantidad Prestada',
            devueltos.CantidadDevuelta AS 'Cantidad Devuelta',
            (dr.Cantidad - devueltos.CantidadDevuelta) AS 'Cantidad Pendiente',
            dr.PrecioUnidad AS 'Precio Unitario',
            (dr.Cantidad - devueltos.CantidadDevuelta) * dr.PrecioUnidad AS 'Valor Pendiente',
            DATEDIFF(CURRENT_DATE, r.FechaCreacion) AS 'Dias en Prestamo',
                TIMESTAMPDIFF(SECOND, r.FechaCreacion, NOW()) / 86400.0 AS 'Dias Exactos en Prestamo',
            CONCAT(
                FLOOR(TIMESTAMPDIFF(HOUR, r.FechaCreacion, NOW()) / 24), ' dias ',
                MOD(TIMESTAMPDIFF(HOUR, r.FechaCreacion, NOW()), 24), ' horas ',
                MOD(TIMESTAMPDIFF(MINUTE, r.FechaCreacion, NOW()), 60), ' minutos'
            ) AS 'Tiempo Exacto en Prestamo',
            ROUND(TIMESTAMPDIFF(MINUTE, r.FechaCreacion, NOW()) / 1440.0, 4) AS 'Dias Facturables',
            (ROUND(TIMESTAMPDIFF(MINUTE, r.FechaCreacion, NOW()) / 1440.0, 4) * dr.PrecioUnidad) AS 'Costo'
        FROM 
            remisiones r
        JOIN 
            detalles_remisiones dr ON r.IdRemision = dr.IdRemision
        JOIN 
            proyectos p ON r.IdProyecto = p.IdProyecto
        JOIN 
            categorias c ON dr.IdCategoria = c.IdCategoria
        JOIN 
            equipo e ON dr.IdEquipo = e.IdEquipo
        LEFT JOIN (
            SELECT 
                dd.IdEquipo,
                d.IdRemision,
                SUM(dd.Cantidad) AS CantidadDevuelta
            FROM 
                detalles_devoluciones dd
            JOIN 
                devoluciones d ON dd.IdDevolucion = d.IdDevolucion
            GROUP BY 
                dd.IdEquipo, d.IdRemision
        ) devueltos ON devueltos.IdRemision = r.IdRemision AND devueltos.IdEquipo = dr.IdEquipo
        WHERE 
            #r.IdEstado = 2 -- Suponiendo que 2 es el estado "Activo" o "Pendiente"
            #AND 
            (dr.Cantidad - COALESCE(devueltos.CantidadDevuelta, 0)) > 0
        ORDER BY 
            r.DocumentoCliente, r.FechaCreacion DESC;
    `;

    sql_con_frenado = `
    SELECT 
    r.DocumentoCliente,
    r.NoRemision,
    r.FechaCreacion AS 'FechaPrestamo',
    d.FechaCreacion AS 'FechaDevolucion',
    p.Nombre AS 'Proyecto',
    e.Nombre AS 'Equipo',
    dr.Cantidad,
    
    CASE 
        WHEN d.IdDevolucion IS NULL THEN 
            CONCAT(
                FLOOR(TIMESTAMPDIFF(HOUR, r.FechaCreacion, NOW()) / 24), ' dias ',
                MOD(TIMESTAMPDIFF(HOUR, r.FechaCreacion, NOW()), 24), ' horas'
            )
        ELSE 
            CONCAT(
                FLOOR(TIMESTAMPDIFF(HOUR, r.FechaCreacion, d.FechaCreacion) / 24), ' dias ',
                MOD(TIMESTAMPDIFF(HOUR, r.FechaCreacion, d.FechaCreacion), 24), ' horas'
            )
    END AS 'TiempoRealEnPrestamo',
    
    CASE 
        WHEN (dr.Cantidad - COALESCE(devueltos.CantidadDevuelta, 0)) > 0 
        THEN (dr.Cantidad - COALESCE(devueltos.CantidadDevuelta, 0)) * dr.PrecioUnidad
        ELSE 0 
    END AS 'ValorPendiente'
FROM 
    remisiones r
JOIN detalles_remisiones dr ON r.IdRemision = dr.IdRemision
LEFT JOIN (
    SELECT 
        IdDevolucion,  -- ¡Aqui está el cambio!
        IdRemision, 
        FechaCreacion
    FROM devoluciones
) d ON r.IdRemision = d.IdRemision
LEFT JOIN (
    SELECT 
        dd.IdEquipo,
        d.IdRemision,
        SUM(dd.Cantidad) AS CantidadDevuelta
    FROM detalles_devoluciones dd
    JOIN devoluciones d ON dd.IdDevolucion = d.IdDevolucion
    GROUP BY dd.IdEquipo, d.IdRemision
) devueltos ON devueltos.IdRemision = r.IdRemision AND devueltos.IdEquipo = dr.IdEquipo
JOIN proyectos p ON r.IdProyecto = p.IdProyecto
JOIN equipo e ON dr.IdEquipo = e.IdEquipo
ORDER BY r.DocumentoCliente, r.FechaCreacion DESC;
    `;

    const sqlold = `
        SELECT 
            dr.IdDetalleRemision AS 'IdDetalleRemision',
            CONCAT(SUBSTRING_INDEX(COALESCE(cliente.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(cliente.Apellidos, ''), ' ', 1)) AS Cliente,
            r.DocumentoCliente,
            r.NoRemision,
            DATE_FORMAT(r.FechaCreacion, '%W %d/%m/%Y a las %l:%i:%s %p') AS 'FechaPrestamo',    
            #r.FechaCreacion AS 'FechaPrestamo',
            DATE_FORMAT(MAX(d.FechaCreacion), '%W %d/%m/%Y a las %l:%i:%s %p') AS 'FechaDevolucion',
            #MAX(d.FechaCreacion) AS 'FechaDevolucion',
            p.Nombre AS 'Proyecto',
            c.Categoria AS 'Categoria',
            e.Nombre AS 'Equipo',
            dr.Cantidad AS 'CantidadPrestada',
            COALESCE(devueltos.CantidadDevuelta, 0) AS 'CantidadDevuelta',
            (dr.Cantidad - COALESCE(devueltos.CantidadDevuelta, 0)) AS 'CantidadPendiente',
            
            -- Cálculo preciso del tiempo de prestamo
            CASE 
                WHEN MAX(d.IdDevolucion) IS NULL THEN 
                    CONCAT(
                        FLOOR(TIMESTAMPDIFF(HOUR, r.FechaCreacion, NOW()) / 24), ' dias ',
                        MOD(TIMESTAMPDIFF(HOUR, r.FechaCreacion, NOW()), 24), ' horas'
                    )
                ELSE 
                    CONCAT(
                        FLOOR(TIMESTAMPDIFF(HOUR, r.FechaCreacion, MAX(d.FechaCreacion)) / 24), ' dias ',
                        MOD(TIMESTAMPDIFF(HOUR, r.FechaCreacion, MAX(d.FechaCreacion)), 24), ' horas'
                    )
            END AS 'TiempoPrestamo',
            
            -- Cálculo para saber si ya se regreso todo lo prestado
            CASE 
                WHEN ((dr.Cantidad - COALESCE(devueltos.CantidadDevuelta, 0))) = 0 THEN 'Completo'
                ELSE 
                    'Pendiente'
            END AS 'Estado',            
            
            -- Valor pendiente de facturacion
            CASE 
                WHEN (dr.Cantidad - COALESCE(devueltos.CantidadDevuelta, 0)) > 0 
                THEN (dr.Cantidad - COALESCE(devueltos.CantidadDevuelta, 0)) * dr.PrecioUnidad
                ELSE 0 
            END AS 'ValorPendiente',
            
            dr.PrecioUnidad AS 'PrecioUnitario'
        FROM 
            remisiones r
        INNER JOIN
            usuario cliente ON r.DocumentoCliente = cliente.DocumentoUsuario
        INNER JOIN 
            detalles_remisiones dr ON r.IdRemision = dr.IdRemision
        LEFT JOIN 
            devoluciones d ON r.IdRemision = d.IdRemision
        LEFT JOIN (
            SELECT 
                dd.IdEquipo,
                d.IdRemision,
                SUM(dd.Cantidad) AS CantidadDevuelta
            FROM 
                detalles_devoluciones dd
            INNER JOIN 
                devoluciones d ON dd.IdDevolucion = d.IdDevolucion
            GROUP BY 
                dd.IdEquipo, d.IdRemision
        ) devueltos ON devueltos.IdRemision = r.IdRemision AND devueltos.IdEquipo = dr.IdEquipo
        INNER JOIN 
            proyectos p ON r.IdProyecto = p.IdProyecto
        INNER JOIN 
            categorias c ON dr.IdCategoria = c.IdCategoria
        INNER JOIN 
            equipo e ON dr.IdEquipo = e.IdEquipo
        WHERE
            r.DocumentoCliente = ?
        GROUP BY 
            r.DocumentoCliente, r.NoRemision, r.FechaCreacion, p.Nombre, 
            c.Categoria, e.Nombre, dr.Cantidad, dr.PrecioUnidad, devueltos.CantidadDevuelta,
            dr.IdDetalleRemision
        ORDER BY 
            r.DocumentoCliente, r.FechaCreacion DESC;
    `;

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
    DATE_FORMAT(r.FechaRemision, '%d/%m/%Y %H:%i') AS FechaRemision,
    
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
        WHEN devueltos.UltimaFechaDevolucion IS NOT NULL THEN
            CONCAT(
                FLOOR(TIMESTAMPDIFF(HOUR, r.FechaRemision, devueltos.UltimaFechaDevolucion) / 24), ' días ',
                MOD(TIMESTAMPDIFF(HOUR, r.FechaRemision, devueltos.UltimaFechaDevolucion), 24), ' horas'
            )
        ELSE
            CONCAT(
                FLOOR(TIMESTAMPDIFF(HOUR, r.FechaRemision, NOW()) / 24), ' días ',
                MOD(TIMESTAMPDIFF(HOUR, r.FechaRemision, NOW()), 24), ' horas'
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
    WHERE d.IdEstado = (SELECT IdEstado FROM estado WHERE Estado LIKE '%Activo%' OR Estado LIKE '%Aprobado%' LIMIT 1)
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