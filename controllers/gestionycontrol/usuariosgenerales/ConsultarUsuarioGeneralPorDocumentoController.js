const { ConsultarUsuarioGeneralPorDocumentoService } = require('../../../services/gestionycontrol/usuariosgenerales/ConsultarUsuarioGeneralPorDocumentoService');

const ConsultarUsuarioGeneralPorDocumentoController = async (req, res) => {
    try {
        const DocumentoUsuarioGeneral = req.params.DocumentoUsuarioGeneral;
        const UsuarioGeneral = await ConsultarUsuarioGeneralPorDocumentoService(DocumentoUsuarioGeneral);
        return res.status(200).json(UsuarioGeneral);
    } catch (error) {
        console.error('Error en ConsultarUsuarioGeneralPorDocumentoController => ', error);
        return res.status(500).json({ error: `Error al consultar el usuario general => error` });
    }
};
module.exports = {
    ConsultarUsuarioGeneralPorDocumentoController
};