const { GuardarEntradaRepuestosQuery } = require('../../../queries/inventario/repuestos/GuardarEntradaRepuestosQuery');

const GuardarEntradaRepuestosService = async (DataEntradaRepuestos) => {
    return await GuardarEntradaRepuestosQuery(DataEntradaRepuestos);
};
module.exports = {
    GuardarEntradaRepuestosService
};