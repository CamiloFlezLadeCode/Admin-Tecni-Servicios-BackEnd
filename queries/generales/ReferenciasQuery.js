const { query } = require('../../config/db');
const ListarReferenciasQuery = async () => {
    const sql = `
        SELECT		
            IdReferencia,
            Referencia,
            Codigo
        FROM		
            referencias AS refe
        INNER JOIN
            estado AS esta ON refe.IdEstado = esta.IdEstado
        WHERE	
            esta.Estado LIKE '%Activo%'
        ORDER BY
            refe.Referencia ASC
    `;
    return query(sql);
};
module.exports = {
    ListarReferenciasQuery
};