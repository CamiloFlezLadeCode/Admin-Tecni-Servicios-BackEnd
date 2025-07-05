const { query } = require('../../../config/db');

const ConsultarSiguienteNoOrdenDeServicioQuery = async () => {
    const sql = `
        SELECT	
        	CASE
            	WHEN	MAX(NoOrdenDeServicio + 1) IS NULL THEN 1
                ELSE MAX(NoOrdenDeServicio + 1)
            END AS SiguienteNoOrdenDeServicio
        FROM
            ordenes_de_servicio
    `;
    return query(sql);
};
module.exports = {
    ConsultarSiguienteNoOrdenDeServicioQuery
};