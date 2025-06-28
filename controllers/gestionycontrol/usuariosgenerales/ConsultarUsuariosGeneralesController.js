const { ConsultarUsuariosGeneralesService } = require('../../../services/gestionycontrol/usuariosgenerales/ConsultarUsuariosGeneralesService');

const ConsultarUsuariosGeneralesController = async (req, res) => {
    try {
        const UsuariosGenerales = await ConsultarUsuariosGeneralesService();
        console.log(`Usuarios generales obtenidos correctamente. Total: ${UsuariosGenerales.length}`);
        return res.status(200).json(UsuariosGenerales);
    } catch (error) {
        console.error('Error en ConsultarUsuariosGeneralesController => ', error);
        return res.status(500).json({ error: `Error al consultar los usuarios generales => error` });
    }
};
module.exports = {
    ConsultarUsuariosGeneralesController
};