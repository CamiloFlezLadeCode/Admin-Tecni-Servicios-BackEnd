const { query } = require('../../../config/db');

const VerCantidadDisponibleQuery = async (IdEquipo) => {
    const sql = `
        SELECT
            Cantidad
        FROM
            equipo
        WHERE
            IdEquipo = ?;
    `;
    return query(sql, [IdEquipo]);
};
module.exports = {
    VerCantidadDisponibleQuery
};