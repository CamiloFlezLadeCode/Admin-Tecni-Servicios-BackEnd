const { query } = require('../../../config/db');

const ConsultarRepuestoPorIdQuery = async (IdRepuesto) => {
    const sql_old = `
        SELECT	
            Nombre AS Nombre,
            Cantidad AS Cantidad,
            IdEstado AS Estado 
        FROM
            repuestos
        WHERE
            IdRepuesto = ?
    `;
    const sql = `
        SELECT	
            repuestos.Nombre AS Nombre,
            Cantidad AS Cantidad,
            repuestos.IdEstado AS Estado,
            unidad.IdUnidad AS IdUnidadDeMedida,
            unidad.Nombre AS NombreUnidad
        FROM
            repuestos
		INNER JOIN 
        	unidad ON repuestos.IdUnidadDeMedida = unidad.IdUnidad
        WHERE
            IdRepuesto = ?
    `
    return query(sql, [IdRepuesto]);
};
module.exports = {
    ConsultarRepuestoPorIdQuery
};