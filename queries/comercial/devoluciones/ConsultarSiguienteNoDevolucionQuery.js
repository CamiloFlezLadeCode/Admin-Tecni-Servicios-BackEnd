const { query } = require('../../../config/db');

const ConsultarSiguienteNoDevolucionQuery = async () => {
    const sql = `
        SELECT	
        	CASE
            	WHEN	MAX(NoDevolucion + 1) IS NULL THEN 1
                ELSE MAX(NoDevolucion + 1)
            END AS SiguienteNoDevolucion
        FROM
            devoluciones
    `;
    return query(sql);
};
module.exports = {
    ConsultarSiguienteNoDevolucionQuery
};