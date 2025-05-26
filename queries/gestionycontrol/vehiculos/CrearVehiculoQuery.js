const { query } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

const CrearVehiculoQuery = async (DatosVehiculo) => {
    const sql = `
        INSERT INTO
            vehiculos
            (Placa, UsuarioCreacion, FechaCreacion, IdEstado)
        VALUES
            ( ?, ?, ?, ? )
    `;
    return query(sql, [
        DatosVehiculo.Placa,
        DatosVehiculo.UsuarioCreacion,
        FechaActualColombia(),
        DatosVehiculo.IdEstado
    ]);
};
module.exports = {
    CrearVehiculoQuery
};