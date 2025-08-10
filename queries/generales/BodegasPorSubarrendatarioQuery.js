const { query } = require('../../config/db');

const ListarBodegasPorSubarrendatarioQuery = async (DocumentoSubarrendatario) => {
    const sql = `
        SELECT 
            NombreBodega, IdBodega
        FROM
            bodegas
        WHERE
            DocumentoSubarrendatario = ?
        ORDER BY
            NombreBodega ASC
    `;
    return query(sql, [DocumentoSubarrendatario]);
};
module.exports = {
    ListarBodegasPorSubarrendatarioQuery
};