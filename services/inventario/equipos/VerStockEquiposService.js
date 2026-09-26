const { VerStockEquiposQuery, VerStockEquiposPaginadoQuery } = require('../../../queries/inventario/equipos/VerStockEquiposQuery');

const VerStockEquiposService = async () => {
    return await VerStockEquiposQuery();
};

const VerStockEquiposPaginadoService = async (paginacion, filtros) => {
    return VerStockEquiposPaginadoQuery(paginacion, filtros);
};
module.exports = {
    VerStockEquiposService,
    VerStockEquiposPaginadoService
};
