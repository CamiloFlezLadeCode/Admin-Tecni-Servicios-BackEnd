const { query } = require('../../../config/db');

const ConsultarSiguienteNoSalidaEquipoQuery = async () => {
    const sql = `
        SELECT
            CASE
                WHEN MAX(NoSalidaEquipo + 1) IS NULL THEN 1
                ELSE MAX(NoSalidaEquipo + 1)
            END AS SiguienteNoSalidaEquipo
        FROM
            salida_equipo
    `;
    return query(sql);
};
module.exports = {
    ConsultarSiguienteNoSalidaEquipoQuery
};
