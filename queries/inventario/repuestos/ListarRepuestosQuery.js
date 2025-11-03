const { query } = require('../../../config/db');

const ListarRepuestosQuery = async () => {
    const sql = `
        SELECT	
            IdRepuesto AS value,
            Nombre AS label
        FROM
            repuestos
        ORDER BY
            Nombre ASC
    `;
    return query(sql);
};
module.exports = {
    ListarRepuestosQuery
};