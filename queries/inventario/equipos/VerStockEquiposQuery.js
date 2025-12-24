const { query } = require('../../../config/db');

const VerStockEquiposQuery = async () => {
    const sql = `
        SELECT
            e.IdEquipo AS IdEquipo,
            e.Nombre AS NombreEquipo,
            e.Cantidad AS Cantidad,
            est.Estado AS Estado,
            um.Nombre AS UnidadMedida
        FROM
            equipo AS e
        LEFT JOIN
            estado AS est ON e.IdEstado = est.IdEstado
        LEFT JOIN
            unidad AS um ON e.IdUnidadDeMedida = um.IdUnidad
        ORDER BY
            e.Nombre ASC
    `;
    return query(sql);
};
module.exports = {
    VerStockEquiposQuery
};
