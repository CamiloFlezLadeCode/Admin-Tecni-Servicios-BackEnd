const { VisualizarSalidaRepuestosQuery } = require('../../../queries/inventario/repuestos/VisualizarSalidaRepuestosQuery');

const VisualizarSalidaRepuestosService = async (NoSalidaRepuestos) => {
    return await VisualizarSalidaRepuestosQuery(NoSalidaRepuestos);
};
module.exports = {
    VisualizarSalidaRepuestosService
};