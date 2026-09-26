const { ConsultarEntradasRepuestosQuery, ConsultarEntradasRepuestosPaginadoQuery } = require('../../../queries/inventario/repuestos/ConsultarEntradasRepuestosQuery');

const ConsultarEntradasRepuestosService = async () => {
    return await ConsultarEntradasRepuestosQuery();
};

const ConsultarEntradasRepuestosPaginadoService = async (paginacion) => {
    return ConsultarEntradasRepuestosPaginadoQuery(paginacion);
};
module.exports = {
    ConsultarEntradasRepuestosService,
    ConsultarEntradasRepuestosPaginadoService
};