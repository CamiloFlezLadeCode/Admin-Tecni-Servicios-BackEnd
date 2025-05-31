const { query } = require('../../../config/db');

const ConsultarSiguienteNoRemisionQuery = async () => {
    const sql = `
        SELECT	
        	CASE
            	WHEN	MAX(IdRemision + 1) IS NULL THEN 1
                ELSE MAX(IdRemision + 1)
            END AS SiguienteNoRemision
        FROM
            remisiones
    `;
    return query(sql);
};
module.exports = {
    ConsultarSiguienteNoRemisionQuery
};