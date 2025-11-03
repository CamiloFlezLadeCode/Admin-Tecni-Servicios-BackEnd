const { query } = require('../../../config/db');

const ConsultarSiguienteNoEntradaEquipoQuery = async () => {
    const sql = `
        SELECT
            CASE
                WHEN MAX(NoEntradaEquipos + 1) IS NULL THEN 1
                ELSE MAX(NoEntradaEquipos + 1)
            END AS SiguienteNoEntradaEquipo
        FROM
            entrada_equipo
    `;
    return query(sql);
};
module.exports = {
    ConsultarSiguienteNoEntradaEquipoQuery
};