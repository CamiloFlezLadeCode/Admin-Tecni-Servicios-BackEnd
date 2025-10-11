const { query } = require('../../../config/db');

const VerCantidadDisponibleQuery = async (IdEquipo) => {
    const sql = `
        SELECT
            #Cantidad,
            CantidadDisponible AS Cantidad,
            PrecioVenta,
            PrecioAlquiler,
            PrecioReparacion,
            uni.Nombre AS UnidadDeMedida
        FROM
            equipo
        INNER JOIN
            unidad AS uni ON equipo.IdUnidadDeMedida = uni.IdUnidad
        WHERE
            IdEquipo = ?;
    `;
    return query(sql, [IdEquipo]);
};
module.exports = {
    VerCantidadDisponibleQuery
};