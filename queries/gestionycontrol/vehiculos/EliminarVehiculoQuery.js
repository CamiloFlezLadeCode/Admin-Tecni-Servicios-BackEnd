const { query } = require('../../../config/db');

const EliminarVehiculoQuery = async (IdVehiculo) => {
    const sql = `
        DELETE FROM 
            vehiculos
        WHERE 
            IdVehiculo = ?
    `;
    return query(sql,[IdVehiculo]);
};
module.exports = {
    EliminarVehiculoQuery
};