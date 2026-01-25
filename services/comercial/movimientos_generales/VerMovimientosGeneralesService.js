const { VerMovimientosGeneralesQuery } = require('../../../queries/comercial/movimientos_generales/VerMovimientosGeneralesQuery');

const VerMovimientosGeneralesService = async (filtros) => {
    return await VerMovimientosGeneralesQuery(filtros);
};

module.exports = {
    VerMovimientosGeneralesService
};
