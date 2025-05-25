const { query } = require('../../config/db');

const ConsultarTiposDeDocumentosQuery = async () => {
    const sql = `
        SELECT
            CAST(IdTipoDocumento AS CHAR) AS IdTipoDocumento,
            Codigo,
            Nombre
        FROM
            tipodocumento
    `;
    return await query(sql);
};
module.exports = {
    ConsultarTiposDeDocumentosQuery
};