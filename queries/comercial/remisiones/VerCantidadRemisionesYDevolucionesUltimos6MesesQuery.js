const { query } = require('../../../config/db');

const VerCantidadRemisionesYDevolucionesUltimos6MesesQuery = async ({ FechaInicio, FechaFinExclusiva }) => {
    const sqlRemisiones = `
        SELECT
            DATE_FORMAT(FechaCreacion, '%Y-%m') AS Mes,
            COUNT(*) AS Cantidad
        FROM remisiones
        WHERE FechaCreacion >= ? AND FechaCreacion < ?
        GROUP BY Mes
        ORDER BY Mes
    `;

    const sqlDevoluciones = `
        SELECT
            DATE_FORMAT(FechaCreacion, '%Y-%m') AS Mes,
            COUNT(*) AS Cantidad
        FROM devoluciones
        WHERE FechaCreacion >= ? AND FechaCreacion < ?
        GROUP BY Mes
        ORDER BY Mes
    `;

    const sqlOrdenesDeServicio = `
        SELECT
            DATE_FORMAT(FechaCreacion, '%Y-%m') AS Mes,
            COUNT(*) AS Cantidad
        FROM ordenes_de_servicio
        WHERE FechaCreacion >= ? AND FechaCreacion < ?
        GROUP BY Mes
        ORDER BY Mes
    `;

    const [remisiones, devoluciones, ordenesDeServicio] = await Promise.all([
        query(sqlRemisiones, [FechaInicio, FechaFinExclusiva]),
        query(sqlDevoluciones, [FechaInicio, FechaFinExclusiva]),
        query(sqlOrdenesDeServicio, [FechaInicio, FechaFinExclusiva])
    ]);

    return { remisiones, devoluciones, ordenesDeServicio };
};

module.exports = {
    VerCantidadRemisionesYDevolucionesUltimos6MesesQuery
};
