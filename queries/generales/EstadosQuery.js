const { query } = require('../../config/db');

const ListarEstadosQuery = async () => {
    const sql = `
        SELECT
            IdEstado,
            Estado
        FROM
            Estado
        ORDER BY
            IdEstado ASC
    `;
    return query(sql);
};
module.exports = {
    ListarEstadosQuery
};