const { ConsultarInformacionUsuarioService } = require('../../../services/gestionycontrol/cuenta/ConsultarInformacionUsuarioService');

const ConsultarInformacionUsuarioController = async (req, res) => {
    try {
        const { DocumentoUsuario } = req.params;
        const InformacionUsuario = await ConsultarInformacionUsuarioService(DocumentoUsuario);
        console.log(`Información del usuario consultada correctamente.`);
        res.status(200).json(InformacionUsuario);
    } catch (error) {
        console.error('Error en ConsultarInformacionUsuarioController => ', error);
        res.status(500).json({ error: `Error al crear equipo => error` });
    }
};
module.exports = {
    ConsultarInformacionUsuarioController
};