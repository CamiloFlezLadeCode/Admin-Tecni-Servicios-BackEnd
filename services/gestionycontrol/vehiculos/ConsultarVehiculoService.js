const { ConsultarVehiculoQuery } = require('../../../queries/gestionycontrol/vehiculos/ConsultarVehiculoQuery');

const ConsultarVehiculoService = async (IdVehiculo) => {
    return await ConsultarVehiculoQuery(IdVehiculo);
};
module.exports = {
    ConsultarVehiculoService
};