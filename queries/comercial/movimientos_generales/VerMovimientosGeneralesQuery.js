const { query } = require('../../../config/db');

const VerMovimientosGeneralesQuery = async (filtros) => {
    const { FechaInicio, FechaFin, DocumentoCliente, IdProyecto } = filtros;
    let params = [];
    let whereClause = " WHERE 1=1 ";

    if (FechaInicio && FechaFin) {
        whereClause += " AND FechaCreacion BETWEEN ? AND ? ";
        params.push(FechaInicio, `${FechaFin} 23:59:59`);
    }

    if (DocumentoCliente) {
        whereClause += " AND DocumentoCliente = ? ";
        params.push(DocumentoCliente);
    }

    if (IdProyecto) {
        whereClause += " AND IdProyecto = ? ";
        params.push(IdProyecto);
    }

    const sql = `
        SELECT 
            remi.IdRemision AS IdMovimiento,
            'REMISION' AS TipoMovimiento,
            remi.NoRemision AS NoMovimiento,
            CONCAT(cliente.Nombres, ' ', cliente.Apellidos) AS Cliente,
            remi.DocumentoCliente,
            proyec.Nombre AS Proyecto,
            remi.FechaRemision AS Fecha,
            ROUND(
                CASE 
                    WHEN esta.Estado LIKE '%Anulado%' OR esta.Estado LIKE '%Cancelado%' THEN 0
                    ELSE (
                        SELECT 
                            SUM(
                                dr.PrecioUnidad * (
                                    -- Parte 1: Unidades ya devueltas (Costo acumulado hasta su fecha de devolución)
                                    COALESCE((
                                        SELECT SUM(dd.Cantidad * GREATEST(1, CEIL(TIMESTAMPDIFF(HOUR, remi.FechaRemision, d.FechaDevolucion) / 24)))
                                        FROM detalles_devoluciones dd
                                        INNER JOIN devoluciones d ON dd.IdDevolucion = d.IdDevolucion
                                        WHERE dd.IdRemision = dr.IdRemision AND dd.IdEquipo = dr.IdEquipo
                                        AND d.IdEstado IN (SELECT IdEstado FROM estado WHERE Estado NOT LIKE '%Anulado%' AND Estado NOT LIKE '%Cancelado%')
                                    ), 0) +
                                    -- Parte 2: Unidades aún pendientes (Costo acumulado hasta hoy)
                                    (
                                        (dr.Cantidad - COALESCE((
                                            SELECT SUM(dd2.Cantidad)
                                            FROM detalles_devoluciones dd2
                                            INNER JOIN devoluciones d2 ON dd2.IdDevolucion = d2.IdDevolucion
                                            WHERE dd2.IdRemision = dr.IdRemision AND dd2.IdEquipo = dr.IdEquipo
                                            AND d2.IdEstado IN (SELECT IdEstado FROM estado WHERE Estado NOT LIKE '%Anulado%' AND Estado NOT LIKE '%Cancelado%')
                                        ), 0)) * 
                                        GREATEST(1, CEIL(TIMESTAMPDIFF(HOUR, remi.FechaRemision, DATE_ADD(UTC_TIMESTAMP(), INTERVAL -5 HOUR)) / 24))
                                    )
                                )
                            )
                        FROM detalles_remisiones dr
                        WHERE dr.IdRemision = remi.IdRemision
                    ) * (1 + COALESCE(remi.IVA, 0) / 100) + COALESCE(remi.ValorTransporte, 0)
                END, 
            2) AS Total,
            esta.Estado AS Estado
        FROM remisiones remi
        INNER JOIN usuario cliente ON remi.DocumentoCliente = cliente.DocumentoUsuario
        LEFT JOIN proyectos proyec ON remi.IdProyecto = proyec.IdProyecto
        INNER JOIN estado esta ON remi.IdEstado = esta.IdEstado
        ${whereClause.replace(/FechaCreacion/g, 'remi.FechaRemision').replace(/DocumentoCliente/g, 'remi.DocumentoCliente').replace(/IdProyecto/g, 'remi.IdProyecto')}

        UNION ALL

        SELECT 
            devo.IdDevolucion AS IdMovimiento,
            'DEVOLUCION' AS TipoMovimiento,
            devo.NoDevolucion AS NoMovimiento,
            CONCAT(cliente.Nombres, ' ', cliente.Apellidos) AS Cliente,
            devo.DocumentoCliente,
            proyec.Nombre AS Proyecto,
            devo.FechaDevolucion AS Fecha,
            ROUND(
                CASE 
                    WHEN esta.Estado LIKE '%Anulado%' OR esta.Estado LIKE '%Cancelado%' THEN 0
                    ELSE devo.ValorTransporte 
                END, 
            2) AS Total,
            esta.Estado AS Estado
        FROM devoluciones devo
        INNER JOIN usuario cliente ON devo.DocumentoCliente = cliente.DocumentoUsuario
        LEFT JOIN proyectos proyec ON devo.IdProyecto = proyec.IdProyecto
        INNER JOIN estado esta ON devo.IdEstado = esta.IdEstado
        ${whereClause.replace(/FechaCreacion/g, 'devo.FechaDevolucion').replace(/DocumentoCliente/g, 'devo.DocumentoCliente').replace(/IdProyecto/g, 'devo.IdProyecto')}

        UNION ALL

        SELECT 
            orden.IdOrdenDeServicio AS IdMovimiento,
            'ORDEN_DE_SERVICIO' AS TipoMovimiento,
            orden.NoOrdenDeServicio AS NoMovimiento,
            CONCAT(cliente.Nombres, ' ', cliente.Apellidos) AS Cliente,
            orden.DocumentoCliente,
            proyec.Nombre AS Proyecto,
            orden.FechaCreacion AS Fecha,
            ROUND(0, 2) AS Total,
            esta.Estado AS Estado
        FROM ordenes_de_servicio orden
        INNER JOIN usuario cliente ON orden.DocumentoCliente = cliente.DocumentoUsuario
        LEFT JOIN proyectos proyec ON orden.IdProyecto = proyec.IdProyecto
        INNER JOIN estado esta ON orden.IdEstado = esta.IdEstado
        ${whereClause.replace(/FechaCreacion/g, 'orden.FechaCreacion').replace(/DocumentoCliente/g, 'orden.DocumentoCliente').replace(/IdProyecto/g, 'orden.IdProyecto')}

        ORDER BY Fecha DESC;
    `;

    // Duplicar los parámetros para cada SELECT en el UNION
    const finalParams = [...params, ...params, ...params];

    return query(sql, finalParams);
};

module.exports = {
    VerMovimientosGeneralesQuery
};
