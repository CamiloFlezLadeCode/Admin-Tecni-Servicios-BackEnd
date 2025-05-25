const { ActualizarUsuarioGeneralQuery } = require('../../../queries/gestionycontrol/usuariosgenerales/ActualizarUsuarioGeneralQuery');

const ActualizarUsuarioGeneralService = async (DatosUsuarioAActualizar) => {
    return await ActualizarUsuarioGeneralQuery(DatosUsuarioAActualizar);
};
module.exports = {
    ActualizarUsuarioGeneralService
};