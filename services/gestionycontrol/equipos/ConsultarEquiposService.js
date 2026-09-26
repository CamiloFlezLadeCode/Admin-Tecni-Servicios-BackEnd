const { ConsultarEquiposQuery, ConsultarEquiposPaginadoQuery } = require('../../../queries/gestionycontrol/equipos/ConsultarEquiposQuery');

const ConsultarEquiposService = async () => {
    return await ConsultarEquiposQuery();
};

const ConsultarEquiposPaginadoService = async (paginacion) => {
    return ConsultarEquiposPaginadoQuery(paginacion);
};
module.exports = {
    ConsultarEquiposService,
    ConsultarEquiposPaginadoService
};