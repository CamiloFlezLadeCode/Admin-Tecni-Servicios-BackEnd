const { ActulizarVehiculoService } = require('../../../services/gestionycontrol/vehiculos/ActualizarVehiculoService');
const { obtenerSocketServer } = require('../../../utils/WebSocket');

const ActualizarVehiculoController = async (req, res) => {
    let DatosVehiculoAActualizar = {};
    try {
        // const DatosVehiculoAActualizar = req.body;
        DatosVehiculoAActualizar = req.body;
        await ActulizarVehiculoService(DatosVehiculoAActualizar);
        console.log(`✅ Vehículo con id: ${DatosVehiculoAActualizar.IdVehiculo}  actualizado correctamente`);
        //Se emite el evento con Socket.IO
        const io = obtenerSocketServer();
        if (io) {
            io.emit('vehiculo-actualizado', DatosVehiculoAActualizar);
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }
        return res.status(204).send();
    } catch (error) {
        console.error('Error en ActualizarVehiculoController => ', error);
        return res.status(500).json({ error: `Error al actualizar el vehículo con id: ${DatosVehiculoAActualizar.IdVehiculo}. Error: ${error}` });
    }
};
module.exports = {
    ActualizarVehiculoController
};