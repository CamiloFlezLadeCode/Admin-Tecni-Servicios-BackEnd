const { ActualizarBodegaService } = require('../../../services/gestionycontrol/bodegas/ActualizarBodegaService');
const { obtenerSocketServer } = require('../../../utils/WebSocket');

const ActualizarBodegaController = async (req, res) => {
    try {
        const NuevosDatosBodega = req.body;
        await ActualizarBodegaService(NuevosDatosBodega);
        console.log(`BODEGA ACTUALIZADA CORRECTAMENTE`);
        // Se emite el evento socket al cliente
        const io = obtenerSocketServer();
        if (io) {
            io.emit('bodega-actualizada', {});
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }
        // ...ActualizarBodegaController.
        return res.status(200).json();
    } catch (error) {
        console.error('Error en ActualizarBodegaController => ', error.message);
        return res.status(500).json({ error: `Error al actualizar la bodega => ${error.message}` });
    }
};
module.exports = {
    ActualizarBodegaController
};