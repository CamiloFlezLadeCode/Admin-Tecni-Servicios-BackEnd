const { EliminarRemisionService } = require('../../../services/comercial/remisiones/EliminarRemisionService');
const { obtenerSocketServer } = require('../../../utils/WebSocket');

const EliminarRemisionController = async (req, res) => {
    try {
        const { IdRemision } = req.query;

        if (!IdRemision) {
            return res.status(400).json({
                success: false,
                message: 'El ID de la remisión es requerido'
            });
        }

        const resultado = await EliminarRemisionService(IdRemision);

        // Se emite evento Socket.IO al cliente
        const io = obtenerSocketServer();
        if (io) {
            io.emit('remision-eliminada', IdRemision);
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }

        return res.status(200).json({
            success: true,
            message: resultado.message,
            data: { IdRemision }
        });
    } catch (error) {
        console.error('Error en eliminarRemisionController:', error);

        const statusCode = error.message.includes('No se puede eliminar') ? 409 : 500;

        return res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {
    EliminarRemisionController
};