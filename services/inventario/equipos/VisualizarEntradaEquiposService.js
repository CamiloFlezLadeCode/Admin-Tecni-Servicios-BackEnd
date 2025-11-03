const { VisualizarEntradaEquiposQuery } = require('../../../queries/inventario/equipos/VisualizarEntradaEquiposQuery');

const VisualizarEntradaEquiposService = async (NoEntradaEquipos) => {
    return await VisualizarEntradaEquiposQuery(NoEntradaEquipos);
};
module.exports = {
    VisualizarEntradaEquiposService
};