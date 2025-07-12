const { EliminarDevolucionService } = require('../../../services/comercial/devoluciones/EliminarDevolucionService');
const { obtenerSocketServer } = require('../../../utils/WebSocket');

const EliminarDevolucionController = async (req, res) => {
    try {
        const { IdDevolucion } = req.query;

        if (!IdDevolucion) {
            return res.status(400).json({
                success: false,
                message: 'El ID de la devolución es requerido'
            });
        }

        const resultado = await EliminarDevolucionService(IdDevolucion);

        // Se emite el evento SocKet.IO al cliente
        const io = obtenerSocketServer();
        if (io) {
            io.emit('devolucion-eliminada', IdDevolucion);
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }

        return res.status(200).json({
            success: true,
            message: resultado.message,
            detallesActualizados: resultado.detallesActualizados
        });
    } catch (error) {
        console.error('Error en eliminarDevolucionController:', error);

        const statusCode = error.message.includes('no puede ser negativa') ? 409 :
            error.message.includes('No se puede eliminar') ? 403 : 500;

        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {
    EliminarDevolucionController
};