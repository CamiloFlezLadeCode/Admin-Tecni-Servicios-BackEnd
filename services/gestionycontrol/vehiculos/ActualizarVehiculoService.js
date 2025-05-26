const { ActualizarVehiculoQuery } = require('../../../queries/gestionycontrol/vehiculos/ActualizarVehiculoQuery');

const ActulizarVehiculoService = async (DatosVehiculo) => {
    return await ActualizarVehiculoQuery(DatosVehiculo);
};
module.exports = {
    ActulizarVehiculoService
};