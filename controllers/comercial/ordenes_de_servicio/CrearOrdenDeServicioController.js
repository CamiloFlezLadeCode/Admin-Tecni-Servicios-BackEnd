const { CrearOrdenDeServicioService } = require('../../../services/comercial/ordenes_de_servicio/CrearOrdenDeServicioService');
const { obtenerSocketServer } = require('../../../utils/WebSocket');

const CrearOrdenDeServicioController = async (req, res) => {
    try {
        const DatosOrdenDeServicio = req.body;
        const OrdenDeServicio = await CrearOrdenDeServicioService(DatosOrdenDeServicio);
        console.log(`Orden de servicio creada correctamente. Orden: ${OrdenDeServicio}`);
        // Se emite evento Socket al cliente
        const io = obtenerSocketServer();
        if (io) {
            io.emit('orden-de-servicio-creada', '');
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }
        // ...
        const IdOrden = OrdenDeServicio.insertId;
        return res.status(201).json(IdOrden);
    } catch (error) {
        console.error('Error en CrearOrdenDeServicioController => ', error.message);
        return res.status(500).json({ error: `Error al crear la orden de servicio => ${error.message}` });
    }
};
module.exports = {
    CrearOrdenDeServicioController
};