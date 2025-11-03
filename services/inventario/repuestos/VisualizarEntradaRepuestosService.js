const { VisualizarEntradaRepuestosQuery } = require('../../../queries/inventario/repuestos/VisualizarEntradaRepuestosQuery');

const VisualizarEntradaRepuestosService = async (NoEntradaRepuestos) => {
    return await VisualizarEntradaRepuestosQuery(NoEntradaRepuestos);
};
module.exports = {
    VisualizarEntradaRepuestosService
};