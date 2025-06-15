const { ActualizarInfoUsuarioQuery } = require('../../../queries/gestionycontrol/cuenta/ActualizarInfoUsuarioQuery');

const ActualizarInfoUsuarioService = async (InfoUsuario) => {
    return await ActualizarInfoUsuarioQuery(InfoUsuario);
};
module.exports = {
    ActualizarInfoUsuarioService
};