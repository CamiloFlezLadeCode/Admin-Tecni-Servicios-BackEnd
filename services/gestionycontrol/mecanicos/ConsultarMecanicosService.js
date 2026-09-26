const { ConsultarMecanicosQuery, ConsultarMecanicosPaginadoQuery } = require('../../../queries/gestionycontrol/mecanicos/ConsultarMecanicosQuery');

const ConsultarMecanicosService = async () => {
    return await ConsultarMecanicosQuery();
};

const ConsultarMecanicosPaginadoService = async (paginacion) => {
    return ConsultarMecanicosPaginadoQuery(paginacion);
};
module.exports = {
    ConsultarMecanicosService,
    ConsultarMecanicosPaginadoService
};