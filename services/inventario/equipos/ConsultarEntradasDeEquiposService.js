const { ConsultarEntradasDeEquiposQuery, ConsultarEntradasDeEquiposPaginadoQuery } = require('../../../queries/inventario/equipos/ConsultarEntradasDeEquiposQuery');

const ConsultarEntradasDeEquiposService = async () => {
    return await ConsultarEntradasDeEquiposQuery();
};

const ConsultarEntradasDeEquiposPaginadoService = async (paginacion) => {
    return ConsultarEntradasDeEquiposPaginadoQuery(paginacion);
};
module.exports = {
    ConsultarEntradasDeEquiposService,
    ConsultarEntradasDeEquiposPaginadoService
};