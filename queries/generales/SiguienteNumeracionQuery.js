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

const SiguienteNumeracion_Para_SalidaRepuestosQuery = async () => {
    const sql = `
        SELECT
            CASE
                WHEN MAX(NoSalidaRepuestos + 1) IS NULL THEN 1
                ELSE MAX(NoSalidaRepuestos + 1)
            END AS SiguienteNoSalidaRepuestos
        FROM
            salida_repuesto
    `;
    return query(sql);
};
module.exports.SiguienteNumeracion_Para_SalidaRepuestosQuery = SiguienteNumeracion_Para_SalidaRepuestosQuery;