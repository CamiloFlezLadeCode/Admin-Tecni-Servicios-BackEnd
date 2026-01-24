const { VerMovimientosGeneralesQuery } = require('../../../queries/comercial/movimientos_generales/VerMovimientosGeneralesQuery');

const VerMovimientosGeneralesService = async () => {
    return await VerMovimientosGeneralesQuery();
};

module.exports = {
    VerMovimientosGeneralesService
};
