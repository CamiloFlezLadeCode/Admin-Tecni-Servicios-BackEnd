const { EliminarVehiculoService } = require('../../../services/gestionycontrol/vehiculos/EliminarVehiculoService');
const { obtenerSocketServer } = require('../../../utils/WebSocket');

const EliminarVehiculoController = async (req, res) => {
    try {
        const { IdVehiculo } = req.params;
        const respuesta = await EliminarVehiculoService(Number(IdVehiculo));
        console.log(`Vehículo eliminado correctamente => ${JSON.stringify(respuesta)}`);
        // Se envía evento de Socket al cliente
        const io = obtenerSocketServer();
        if (io) {
            io.emit('vehiculo-eliminado', IdVehiculo);
            // io.emit('vehiculo-eliminado', { tipo: 'vehiculo-eliminado', id: IdVehiculo });
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }
        // ...
        return res.status(200).json({ mensaje: 'Vehículo eliminado exitosamente' });
    } catch (error) {
        console.error('Error en EliminarVehiculoController =>', error.message);
        if (error.message.includes('remisiones asociadas')) {
            // return res.status(409).json({ error: error.message }); // 409: Conflict
            return res.status(409).json({ mensaje: 'remisiones asociadas' });
        }
        return res.status(500).json({ error: `Error al eliminar el vehículo => ${error.message}` });
    }
};

module.exports = {
    EliminarVehiculoController
};
