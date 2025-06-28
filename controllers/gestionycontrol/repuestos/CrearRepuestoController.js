const { CrearRepuestoService } = require('../../../services/gestionycontrol/repuestos/CrearRepuestoService');
const { obtenerSocketServer } = require('../../../utils/WebSocket');

const CrearRepuestoController = async (req, res) => {
    try {
        const DatosRepuesto = req.body;
        await CrearRepuestoService(DatosRepuesto);
        console.log('Repuesto creado correctamente');
        //Se emite el evento Socket al cliente
        const io = obtenerSocketServer();
        if (io) {
            io.emit('repuesto-creado', DatosRepuesto);
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }
        // ...
        return res.status(200).json('Repuesto creado correctamente');
    } catch (error) {
        console.error('Error en CrearRepuestoController => ', error);
        return res.status(500).json({ error: `Error al crear el repuesto => ${error}` });
    }
};
module.exports = {
    CrearRepuestoController
};