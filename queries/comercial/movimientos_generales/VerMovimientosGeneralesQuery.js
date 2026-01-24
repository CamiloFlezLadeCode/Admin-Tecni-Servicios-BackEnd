const { query } = require('../../../config/db');

const VerMovimientosGeneralesQuery = async () => {
    const sql = `
        SELECT 
            remi.IdRemision AS IdMovimiento,
            'REMISION' AS TipoMovimiento,
            remi.NoRemision AS NoMovimiento,
            CONCAT(cliente.Nombres, ' ', cliente.Apellidos) AS Cliente,
            remi.DocumentoCliente,
            proyec.Nombre AS Proyecto,
            remi.FechaCreacion AS Fecha,
            remi.PrecioTotalGeneralConIVA AS Total,
            esta.Estado AS Estado
        FROM remisiones remi
        INNER JOIN usuario cliente ON remi.DocumentoCliente = cliente.DocumentoUsuario
        LEFT JOIN proyectos proyec ON remi.IdProyecto = proyec.IdProyecto
        INNER JOIN estado esta ON remi.IdEstado = esta.IdEstado

        UNION ALL

        SELECT 
            devo.IdDevolucion AS IdMovimiento,
            'DEVOLUCION' AS TipoMovimiento,
            devo.NoDevolucion AS NoMovimiento,
            CONCAT(cliente.Nombres, ' ', cliente.Apellidos) AS Cliente,
            devo.DocumentoCliente,
            proyec.Nombre AS Proyecto,
            devo.FechaCreacion AS Fecha,
            devo.ValorTransporte AS Total,
            esta.Estado AS Estado
        FROM devoluciones devo
        INNER JOIN usuario cliente ON devo.DocumentoCliente = cliente.DocumentoUsuario
        LEFT JOIN proyectos proyec ON devo.IdProyecto = proyec.IdProyecto
        INNER JOIN estado esta ON devo.IdEstado = esta.IdEstado

        UNION ALL

        SELECT 
            orden.IdOrdenDeServicio AS IdMovimiento,
            'ORDEN_DE_SERVICIO' AS TipoMovimiento,
            orden.NoOrdenDeServicio AS NoMovimiento,
            CONCAT(cliente.Nombres, ' ', cliente.Apellidos) AS Cliente,
            orden.DocumentoCliente,
            proyec.Nombre AS Proyecto,
            orden.FechaCreacion AS Fecha,
            0 AS Total,
            esta.Estado AS Estado
        FROM ordenes_de_servicio orden
        INNER JOIN usuario cliente ON orden.DocumentoCliente = cliente.DocumentoUsuario
        LEFT JOIN proyectos proyec ON orden.IdProyecto = proyec.IdProyecto
        INNER JOIN estado esta ON orden.IdEstado = esta.IdEstado

        ORDER BY Fecha DESC;
    `;
    return query(sql);
};

module.exports = {
    VerMovimientosGeneralesQuery
};
