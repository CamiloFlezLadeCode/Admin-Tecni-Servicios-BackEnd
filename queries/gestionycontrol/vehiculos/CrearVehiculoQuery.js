const { query } = require('../../../config/db');

const CrearVehiculoQuery = async (DatosVehiculo) => {
    const sql = `
        INSERT INTO
            vehiculos
            (Placa, IdEstado)
        VALUES
            ( ?, ? )
    `;
    return query(sql, [
        DatosVehiculo.Placa,
        DatosVehiculo.IdEstado
    ]);
};
module.exports = {
    CrearVehiculoQuery
};