const { GuardarEntradaEquiposService } = require('../../../services/inventario/equipos/GuardarEntradaEquiposService');
const { obtenerSocketServer } = require('../../../utils/WebSocket');

const GuardarEntradaEquiposController = async (req, res) => {
    try {
        const DataEntradaEquipos = req.body;
        await GuardarEntradaEquiposService(DataEntradaEquipos);
        const io = obtenerSocketServer();
        if (io) {
            io.emit('entrada-equipos-creada', '');
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }
        console.log(`Entrada de equipos guardada correctamente...`);
        return res.status(200).json();
    } catch (error) {
        console.error('Error en GuardarEntradaEquiposControllerController => ', error.message);
        return res.status(500).json({ error: `Error al => ${error.message}` });
    }
};
module.exports = {
    GuardarEntradaEquiposController
};