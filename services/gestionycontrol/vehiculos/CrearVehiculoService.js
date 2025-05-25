const { CrearVehiculoQuery } = require('../../../queries/gestionycontrol/vehiculos/CrearVehiculoQuery');

const CrearVehiculoService = async (DatosVehiculo) => {
    return await CrearVehiculoQuery(DatosVehiculo);
};
module.exports = {
    CrearVehiculoService
};