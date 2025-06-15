const { ActualizarContrasenaService } = require('../../../services/gestionycontrol/ajustes/ActualizarContrasenaService');

const ActualizarContrasenaController = async (req, res) => {
    try {
        const DatosCredenciales = req.body;
        await ActualizarContrasenaService(DatosCredenciales);
        console.log(`Credenciales actualizadas correctamente`);
        return res.status(204).send();
    } catch (error) {
        console.error('Error en ActualizarContrasenaController => ', error);
        res.status(500).json({ error: `Error al actualizar la contraseña => ${error}` });
    }
};
module.exports = {
    ActualizarContrasenaController
};