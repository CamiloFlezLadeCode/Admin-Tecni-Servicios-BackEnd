const { EliminarOrdenDeServicioService } = require('../../../services/comercial/ordenes_de_servicio/EliminarOrdenDeServicioService');
const { obtenerSocketServer } = require('../../../utils/WebSocket');

const EliminarOrdenDeServicioController = async (req, res) => {
    try {
        const { IdOrdenDeServicio } = req.query;

        if (!IdOrdenDeServicio) {
            return res.status(400).json({
                success: false,
                message: 'El ID de la orden de servicio es requerido'
            });
        }

        const resultado = await EliminarOrdenDeServicioService(IdOrdenDeServicio);

        // Se emite evento SocKet.IO al cliente
        const io = obtenerSocketServer();
        if (io) {
            io.emit('orden-de-servicio-eliminada', IdOrdenDeServicio);
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }

        return res.status(200).json({
            success: true,
            message: resultado.message,
            // detallesActualizados: resultado.detallesActualizados
        });
    } catch (error) {
        console.error('Error en EliminarOrdenDeServicioController => ', error);

        const statusCode = error.message.includes('no puede ser negativa') ? 409 :
            error.message.includes('No se puede eliminar') ? 403 : 500;

        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {
    EliminarOrdenDeServicioController
};