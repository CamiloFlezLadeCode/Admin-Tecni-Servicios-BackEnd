const { query } = require('../../../config/db');

const VerDisponibilidadEquiposQuery = async (ParametrosConsulta) => {
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
            ( IdCategoria = ? ) AND
            ( DocumentoSubarrendatario = ? )
        ORDER BY
            equi.Nombre ASC
    `;
    return query(sql, [
        ParametrosConsulta.IdCategoria,
        ParametrosConsulta.DocumentoSubarrendatario
    ]);
};
module.exports = {
    VerDisponibilidadEquiposQuery
};