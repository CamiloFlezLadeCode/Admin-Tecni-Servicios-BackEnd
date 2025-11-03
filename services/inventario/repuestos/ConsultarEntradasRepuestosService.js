const { ConsultarEntradasRepuestosQuery } = require('../../../queries/inventario/repuestos/ConsultarEntradasRepuestosQuery');

const ConsultarEntradasRepuestosService = async () => {
    return await ConsultarEntradasRepuestosQuery();
};
module.exports = {
    ConsultarEntradasRepuestosService
};