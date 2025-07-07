const { CrearDevolucionService } = require('../../../services/comercial/devoluciones/CrearDevolucionService');
const { obtenerSocketServer } = require('../../../utils/WebSocket');

const CrearDevolucionController = async (req, res) => {
    try {
        const datosDevolucion = req.body;

        if (!datosDevolucion) {
            throw new Error('No se recibieron datos para crear la devolución');
        }

        const resultado = await CrearDevolucionService(datosDevolucion);

        console.log(`Devolución creada exitosamente con ID: ${resultado.IdDevolucion}`);
        // Se emite evento Socket al cliente
        const io = obtenerSocketServer();
        if (io) {
            io.emit('devolucion-creada', '');
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }
        // ...
        return res.status(201).json({
            success: true,
            message: 'Devolución creada exitosamente',
            IdDevolucion: resultado.IdDevolucion
        });
    } catch (error) {
        console.error('Error en CrearDevolucionController => ', error.message);
        return res.status(500).json({
            success: false,
            error: `Error al crear la devolución => ${error.message}`
        });
    }
};

module.exports = {
    CrearDevolucionController
};