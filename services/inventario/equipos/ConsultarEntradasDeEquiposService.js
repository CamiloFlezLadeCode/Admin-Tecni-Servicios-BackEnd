const { ConsultarEntradasDeEquiposQuery } = require('../../../queries/inventario/equipos/ConsultarEntradasDeEquiposQuery');

const ConsultarEntradasDeEquiposService = async () => {
    return await ConsultarEntradasDeEquiposQuery();
};
module.exports = {
    ConsultarEntradasDeEquiposService
};