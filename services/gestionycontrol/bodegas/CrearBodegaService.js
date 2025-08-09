const { CrearBodegaQuery } = require('../../../queries/gestionycontrol/bodegas/CrearBodegaQuery');

const CrearBodegaService = async (DatosNuevaBodega) => {
    return await CrearBodegaQuery(DatosNuevaBodega);
};
module.exports = {
    CrearBodegaService
};