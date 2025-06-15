const { ActualizarInfoUsuarioService } = require('../../../services/gestionycontrol/cuenta/ActualizarInfoUsuarioService');
const { obtenerSocketServer } = require('../../../utils/WebSocket'); // debes tener este helper para acceder a io

const ActualizarInfoUsuarioController = async (req, res) => {
    try {
        const InfoUsuario = req.body;
        await ActualizarInfoUsuarioService(InfoUsuario);
        // Se emite el evento Socket.IO al cliente
        const io = obtenerSocketServer();
        if (io) {
            io.emit('informacion-usuario-activo-actualizada', InfoUsuario);
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }
        // ...
        return res.status(204).send();
    } catch (error) {
        console.error('Error en ActualizarInfoUsuarioController => ', error);
        res.status(500).json({ error: `Error al actualizar información del usuario => ${error}` });
    }
};
module.exports = {
    ActualizarInfoUsuarioController
};