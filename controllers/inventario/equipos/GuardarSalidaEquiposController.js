const { GuardarSalidaEquiposService } = require('../../../services/inventario/equipos/GuardarSalidaEquiposService');
const { obtenerSocketServer } = require('../../../utils/WebSocket');

const GuardarSalidaEquiposController = async (req, res) => {
    try {
        const DataSalidaEquipos = req.body;
// console.log(DataSalidaEquipos)
        if (!DataSalidaEquipos || !DataSalidaEquipos.Equipos || DataSalidaEquipos.Equipos.length === 0) {
            return res.status(400).json({ error: 'Datos de salida inválidos o vacíos' });
        }
        const Resultado = await GuardarSalidaEquiposService(DataSalidaEquipos);
        const io = obtenerSocketServer();
        if (io) {
            io.emit('salida-equipos-creada', '');
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }
        return res.status(200).json(Resultado);
    } catch (error) {
        console.error('Error en GuardarSalidaEquiposController => ', error.message);
        return res.status(500).json({ error: `Error al guardar la salida de equipos => ${error.message}` });
    }
};
module.exports = {
    GuardarSalidaEquiposController
};
