const { ActualizarRepuestoService } = require('../../../services/gestionycontrol/repuestos/ActualizarRepuestoService');
const { obtenerSocketServer } = require('../../../utils/WebSocket');

const ActualizarRepuestoController = async (req, res) => {
    try {
        const DatosRepuesto = req.body;
        await ActualizarRepuestoService(DatosRepuesto);
        // Se envía el evento socket
        const io = obtenerSocketServer();
        if (io) {
            io.emit('repuesto-actualizado', DatosRepuesto);
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }
        // ...
        console.log(`Repuesto actualizado correctamente`);
        return res.status(204).send();
    } catch (error) {
        console.error('Error en ActualizarRepuestoController => ', error);
        return res.status(500).json({ error: `Error al actualizar el repuesto => ${error}` });
    }
};
module.exports = {
    ActualizarRepuestoController
};