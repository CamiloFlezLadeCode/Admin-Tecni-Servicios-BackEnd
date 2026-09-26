const { ConsultarRemisionesQuery, ConsultarRemisionesPaginadoQuery } = require('../../../queries/comercial/remisiones/ConsultarRemisionesQuery');

const ConsultarRemisionesService = async () => {
    return await ConsultarRemisionesQuery();
};

const ConsultarRemisionesPaginadoService = async (paginacion) => {
    return ConsultarRemisionesPaginadoQuery(paginacion);
};
module.exports = {
    ConsultarRemisionesService,
    ConsultarRemisionesPaginadoService
};