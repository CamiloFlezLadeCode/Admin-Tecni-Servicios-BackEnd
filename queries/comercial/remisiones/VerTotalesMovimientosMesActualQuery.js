const { query } = require('../../../config/db');

const VerTotalesMovimientosMesActualQuery = async ({ FechaInicio, FechaFinExclusiva }) => {
    const sqlRemisiones = `
        SELECT COUNT(*) AS Cantidad
        FROM remisiones
        WHERE FechaCreacion >= ? AND FechaCreacion < ?
    `;

    const sqlDevoluciones = `
        SELECT COUNT(*) AS Cantidad
        FROM devoluciones
        WHERE FechaCreacion >= ? AND FechaCreacion < ?
    `;

    const sqlOrdenesDeServicio = `
        SELECT COUNT(*) AS Cantidad
        FROM ordenes_de_servicio
        WHERE FechaCreacion >= ? AND FechaCreacion < ?
    `;

    const [remisiones, devoluciones, ordenesDeServicio] = await Promise.all([
        query(sqlRemisiones, [FechaInicio, FechaFinExclusiva]),
        query(sqlDevoluciones, [FechaInicio, FechaFinExclusiva]),
        query(sqlOrdenesDeServicio, [FechaInicio, FechaFinExclusiva])
    ]);

    return {
        CantidadRemisiones: Number(remisiones?.[0]?.Cantidad) || 0,
        CantidadDevoluciones: Number(devoluciones?.[0]?.Cantidad) || 0,
        CantidadOrdenesDeServicio: Number(ordenesDeServicio?.[0]?.Cantidad) || 0
    };
};

module.exports = {
    VerTotalesMovimientosMesActualQuery
};

