const { VerMovimientosGeneralesQuery, VerMovimientosGeneralesPaginadoQuery } = require('../../../queries/comercial/movimientos_generales/VerMovimientosGeneralesQuery');

const VerMovimientosGeneralesService = async (filtros) => {
    return await VerMovimientosGeneralesQuery(filtros);
};

const VerMovimientosGeneralesPaginadoService = async (filtros, paginacion) => {
    return VerMovimientosGeneralesPaginadoQuery(filtros, paginacion);
};

module.exports = {
    VerMovimientosGeneralesService,
    VerMovimientosGeneralesPaginadoService
};
