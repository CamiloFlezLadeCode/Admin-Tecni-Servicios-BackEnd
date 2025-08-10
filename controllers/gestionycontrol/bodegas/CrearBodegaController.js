const { CrearBodegaService } = require('../../../services/gestionycontrol/bodegas/CrearBodegaService');
const { obtenerSocketServer } = require('../../../utils/WebSocket');

const CrearBodegaController = async (req, res) => {
    try {
        const DatosNuevaBodega = req.body;
        await CrearBodegaService(DatosNuevaBodega);
        const io = obtenerSocketServer();
        if (io) {
            io.emit('bodega-creada', '');
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }
        return res.status(200).json();
    } catch (error) {
        console.error('Error en CrearBodegaController => ', error.message);
        return res.status(500).json({ error: `Error al crear la bodega => ${error.message}` });
    }
};
module.exports = {
    CrearBodegaController
};