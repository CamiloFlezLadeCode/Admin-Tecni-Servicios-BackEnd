const { ListarRepuestosQuery } = require('../../../queries/inventario/repuestos/ListarRepuestosQuery');

const ListarRepuestosService = async () => {
    return await ListarRepuestosQuery();
};
module.exports = {
    ListarRepuestosService
};