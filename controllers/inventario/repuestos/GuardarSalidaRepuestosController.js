const { GuardarSalidaRepuestosService } = require('../../../services/inventario/repuestos/GuardarSalidaRepuestosService');
const { obtenerSocketServer } = require('../../../utils/WebSocket');

const GuardarSalidaRepuestosController = async (req, res) => {
    try {
        const DataSalidaRepuestos = req.body;
        const Resultado = await GuardarSalidaRepuestosService(DataSalidaRepuestos);
        const io = obtenerSocketServer();
        if (io) {
            io.emit('salida-repuestos-creada', '');
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }
        return res.status(201).json(Resultado);
    } catch (error) {
        return res.status(500).json({ error: `Error al guardar salida de repuestos => ${error.message}` });
    }
};
module.exports = {
    GuardarSalidaRepuestosController
};