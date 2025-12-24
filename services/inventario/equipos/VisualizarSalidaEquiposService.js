const { VisualizarSalidaEquiposQuery } = require('../../../queries/inventario/equipos/VisualizarSalidaEquiposQuery');

const VisualizarSalidaEquiposService = async (NoSalidaEquipos) => {
    return await VisualizarSalidaEquiposQuery(NoSalidaEquipos);
};
module.exports = {
    VisualizarSalidaEquiposService
};
