const { ConsultarUsuarioGeneralPorDocumentoQuery } = require('../../../queries/gestionycontrol/usuariosgenerales/ConsultarUsuarioGeneralPorDocumentoQuery');

const ConsultarUsuarioGeneralPorDocumentoService = async (DocumentoUsuarioGeneral) => {
    return await ConsultarUsuarioGeneralPorDocumentoQuery(DocumentoUsuarioGeneral);
};
module.exports = {
    ConsultarUsuarioGeneralPorDocumentoService
};