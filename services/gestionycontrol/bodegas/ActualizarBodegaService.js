const { ActualizarBodegaQuery } = require('../../../queries/gestionycontrol/bodegas/ActualizarBodegaQuery');

const ActualizarBodegaService = async (NuevosDatosBodega) => {
    return await ActualizarBodegaQuery(NuevosDatosBodega);
};
module.exports = {
    ActualizarBodegaService
};