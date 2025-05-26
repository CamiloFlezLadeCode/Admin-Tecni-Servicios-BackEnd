const { query } = require('../../../config/db');

const ActualizarVehiculoQuery = async (DatosVehiculo) => {
    const sql = `
        UPDATE 
            vehiculos
        SET 
            Placa = ? , IdEstado = ?
        WHERE 
            vehiculos.IdVehiculo = ?;
    `;
    return query(sql, [
        DatosVehiculo.Placa,
        DatosVehiculo.IdEstado,
        DatosVehiculo.IdVehiculo,
    ]);
};
module.exports = {
    ActualizarVehiculoQuery
};