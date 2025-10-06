const { query } = require('../../../config/db');

const ConsultarBodegaPorIdQuery = async (IdBodega) => {
    const sql = `
        SELECT	
            NombreBodega,
            Descripcion,
            IdTipoBodega,
            IdEstado
        FROM
            bodegas
        WHERE
            IdBodega=?
    `;
    return query(sql, [IdBodega]);
};
module.exports = {
    ConsultarBodegaPorIdQuery
};