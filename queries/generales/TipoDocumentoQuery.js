const { query } = require('../../config/db');

const ConsultarTiposDeDocumentosQuery = async () => {
    const sql = `
        SELECT
            IdTipoDocumento,
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