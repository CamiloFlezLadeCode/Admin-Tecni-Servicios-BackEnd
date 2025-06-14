const { query } = require('../../../config/db');

const ConsultarRepuestoPorIdQuery = async (IdRepuesto) => {
    const sql = `
        SELECT	
            Nombre AS Nombre,
            Cantidad AS Cantidad,
            IdEstado AS Estado 
        FROM
            repuestos
        WHERE
            IdRepuesto = ?
    `;
    return query(sql, [IdRepuesto]);
};
module.exports = {
    ConsultarRepuestoPorIdQuery
};