const { ConsultarVehiculosQuery, ConsultarVehiculosPaginadoQuery } = require('../../../queries/gestionycontrol/vehiculos/ConsultarVehiculosQuery');

const ConsultarVehiculosService = async () => {
    return await ConsultarVehiculosQuery();
};

const ConsultarVehiculosPaginadoService = async (paginacion) => {
    return ConsultarVehiculosPaginadoQuery(paginacion);
};
module.exports = {
    ConsultarVehiculosService,
    ConsultarVehiculosPaginadoService
};