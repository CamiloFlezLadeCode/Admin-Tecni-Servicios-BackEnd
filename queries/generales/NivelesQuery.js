const { query } = require('../../config/db');

const ListarNivelesQuery = async () => {
    const sql = `
        SELECT
            IdNivel,
            Nivel 
        FROM
            niveles
        ORDER BY
            IdNivel ASC
    `;
    return query(sql);
};
module.exports = {
    ListarNivelesQuery
};