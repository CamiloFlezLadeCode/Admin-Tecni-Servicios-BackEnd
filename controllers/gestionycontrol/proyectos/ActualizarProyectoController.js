const { ActualizarProyectoService } = require('../../../services/gestionycontrol/proyectos/ActualizarProyectoService');
const { obtenerSocketServer } = require('../../../utils/WebSocket'); // debes tener este helper para acceder a io

const ActualizarProyectoController = async (req, res) => {
    try {
        const DatosProyecto = req.body;
        await ActualizarProyectoService(DatosProyecto);
        console.log('Proyecto actualizado correctamente');
        // Emitir el evento con Socket.IO
        const io = obtenerSocketServer();
        if (io) {
            io.emit('proyecto-actualizado', DatosProyecto);
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }
        return res.status(204).send()
    } catch (error) {
        console.error('Error en ActualizarProyectoController => ', error);
        return res.status(500).json({ error: `Error al actualizar el proyecto => ${error}` });
    }
};
module.exports = {
    ActualizarProyectoController
};