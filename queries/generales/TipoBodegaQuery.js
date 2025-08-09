const { query } = require('../../config/db');

const TipoBodegaQuery = async () => {
    const sql = `
        SELECT * FROM tipo_bodega ORDER BY TipoBodega ASC
    `;
    return query(sql);
};
module.exports = {
    TipoBodegaQuery
};