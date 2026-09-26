const { ConsultarRepuestosQuery, ConsultarRepuestosPaginadoQuery } = require('../../../queries/gestionycontrol/repuestos/ConsultarRepuestosQuery');

const ConsultarRepuestosService = async () => {
    return await ConsultarRepuestosQuery();
};

const ConsultarRepuestosPaginadoService = async (paginacion) => {
    return ConsultarRepuestosPaginadoQuery(paginacion);
};
module.exports = {
    ConsultarRepuestosService,
    ConsultarRepuestosPaginadoService
};