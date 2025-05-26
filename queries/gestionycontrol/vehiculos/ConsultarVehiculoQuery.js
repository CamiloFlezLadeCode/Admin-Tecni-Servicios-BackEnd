const { query } = require('../../../config/db');

const ConsultarVehiculoQuery = async (IdVehiculo) => {
    const sql = `
        SELECT
            Placa, IdEstado
        FROM
            vehiculos
        WHERE
            IdVehiculo = ?
    `;
    return query(sql, IdVehiculo);
};
module.exports = {
    ConsultarVehiculoQuery
};