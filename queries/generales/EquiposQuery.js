const { query } = require('../../config/db');

const ListarEquiposQuery = async (referencia) => {
    const sql = `
        SELECT
            equi.IdEquipo,
            equi.Nombre,
            esta.Estado
        FROM
            equipo as equi
        INNER JOIN
            estado AS esta ON equi.IdEstado = esta.IdEstado 
        WHERE
            IdCategoria = ?
        ORDER BY
            equi.Nombre ASC
    `;
    return query(sql,[
        referencia.IdCategoria
    ]);
};
module.exports = {
    ListarEquiposQuery
};