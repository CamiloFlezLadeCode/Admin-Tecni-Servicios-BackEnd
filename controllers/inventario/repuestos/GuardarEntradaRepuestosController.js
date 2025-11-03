const { GuardarEntradaRepuestosService } = require('../../../services/inventario/repuestos/GuardarEntradaRepuestosService');
const { obtenerSocketServer } = require('../../../utils/WebSocket');

const GuardarEntradaRepuestosController = async (req, res) => {
    try {
        const DataEntradaRepuestos = req.body;
        if (!DataEntradaRepuestos || Object.keys(DataEntradaRepuestos).length === 0) return res.status(400).json({ error: "El cuerpo de la petición está vacío o es inválido." });
        await GuardarEntradaRepuestosService(DataEntradaRepuestos);
        const io = obtenerSocketServer();
        if (io) {
            io.emit('entrada-repuestos-creada', '');
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }
        console.log(`Entrada de repuestos guardada correctamente...`);
        return res.status(200).json();
    } catch (error) {
        console.error('Error en GuardarEntradaRepuestosController => ', error.message);
        return res.status(500).json({ error: `Error al => ${error.message}` });
    }
};
module.exports = {
    GuardarEntradaRepuestosController
};