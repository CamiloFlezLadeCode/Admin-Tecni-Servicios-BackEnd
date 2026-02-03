const { query } = require('../../../config/db');

const VerStockRepuestosQuery = async () => {
    const sql = `
        SELECT
            rep.IdRepuesto AS IdRepuesto,
            rep.Nombre AS NombreRepuesto,
            rep.CantidadDisponible AS CantidadDisponible,
            #est.Estado AS Estado
            CASE 
            	WHEN rep.CantidadDisponible <= 0 THEN 'No disponible'
                ELSE 'Disponible'
			END AS Estado   
        FROM
            repuestos AS rep
        LEFT JOIN
            estado AS est ON rep.IdEstado = est.IdEstado
        ORDER BY
            rep.Nombre ASC
    `;
    return query(sql);
};
module.exports = {
    VerStockRepuestosQuery
};