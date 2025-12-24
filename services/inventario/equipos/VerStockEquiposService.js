const { VerStockEquiposQuery } = require('../../../queries/inventario/equipos/VerStockEquiposQuery');

const VerStockEquiposService = async () => {
    return await VerStockEquiposQuery();
};
module.exports = {
    VerStockEquiposService
};
