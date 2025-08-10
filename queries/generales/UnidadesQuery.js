const { query } = require('../../config/db');

const ListarUnidadesQuery = async () => {
    const sql = `
        SELECT 
            IdUnidad, Nombre
        FROM
            unidad
        WHERE
            IdEstado = ?
    `;
    const EstadoUnidad = 1;
    return query(sql, [EstadoUnidad]);
};
module.exports = {
    ListarUnidadesQuery
};