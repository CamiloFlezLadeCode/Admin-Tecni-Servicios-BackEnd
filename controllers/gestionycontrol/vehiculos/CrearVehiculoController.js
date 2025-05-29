const { CrearVehiculoService } = require('../../../services/gestionycontrol/vehiculos/CrearVehiculoService');
const { obtenerSocketServer } = require('../../../utils/WebSocket');

const CrearVehiculoController = async (req, res) => {
    try {
        const DatosVehiculo = req.body;
        await CrearVehiculoService(DatosVehiculo);
        console.log("Vehículo creado correctamente.");
        //Se emite el evento con Socket.IO
        const io = obtenerSocketServer();
        if (io) {
            io.emit('vehiculo-creado', DatosVehiculo);
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        };
        res.status(200).json('Vehículo creado correctamente.');
    } catch (error) {
        console.error('Error en CrearVehiculoController => ', error);
        res.status(500).json({ error: `Error al crear el vehiculo => ${error}` });
    }
};
module.exports = {
    CrearVehiculoController
};