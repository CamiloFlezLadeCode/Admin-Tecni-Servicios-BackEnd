const { ConsultarInformacionUsuarioQuery } = require('../../../queries/gestionycontrol/cuenta/ConsultarInformacionUsuarioQuery');

const ConsultarInformacionUsuarioService = async (DocumentoUsuario) => {
    return await ConsultarInformacionUsuarioQuery(DocumentoUsuario);
};
module.exports = {
    ConsultarInformacionUsuarioService
};