const { CrearRemisionService } = require('../../../services/comercial/remisiones/CrearRemisionService');
const { obtenerSocketServer } = require('../../../utils/WebSocket');

const CrearRemisionController = async (req, res) => {
    try {
        const DatosRemision = req.body;
        // Validación de datos importantes
        if (!Array.isArray(DatosRemision.Detalles) || DatosRemision.Detalles.length === 0) {
            return res.status(400).json({ error: 'Debes incluir al menos un ítem en la remisión.' });
        }
        //...

        //Se ejecuta/consume el servicio
        const Resultado = await CrearRemisionService(DatosRemision);
        console.log("✅ Remisión creada correctamente");
        //...

        // Se emite evento socket al cliente
        const io = obtenerSocketServer();
        if (io) {
            io.emit('remision-creada', '');
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }
        // ...

        //Se retorna respuesta al frontend/cliente
        return res.status(200).json({
            message: 'Remisión creada correctamente',
            data: Resultado
        })
        //...
    } catch (error) {
        console.error('Error en CrearRemisionController => ', error);
        return res.status(500).json({ error: `Error al crear la remisión => ${error}` });
    }
};
module.exports = {
    CrearRemisionController
};