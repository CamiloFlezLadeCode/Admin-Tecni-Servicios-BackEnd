const { query } = require('../../config/db');

const SiguienteNumeracion_Para_EntradaRepuestosQuery = async () => {
    const sql = `
        SELECT
            CASE
                WHEN MAX(NoEntradaRepuestos + 1) IS NULL THEN 1
                ELSE MAX(NoEntradaRepuestos + 1)
            END AS SiguienteNoEntradaRepuestos
        FROM
            entrada_repuesto
    `;
    return query(sql);
};
module.exports = {
    SiguienteNumeracion_Para_EntradaRepuestosQuery
};