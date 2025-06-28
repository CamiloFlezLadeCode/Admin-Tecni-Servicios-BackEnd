const { CrearProyectoService } = require('../../../services/gestionycontrol/proyectos/CrearProyectoService');
const { obtenerSocketServer } = require('../../../utils/WebSocket'); // debes tener este helper para acceder a io

const CrearProyectoController = async (req, res) => {
    try {
        const proyectoData = req.body;
        if (!proyectoData.UsuarioCreacion) {
            return res.status(400).json({ error: 'UsuarioCreacion es requerido' });
        }
        const resultado = await CrearProyectoService(proyectoData);
        console.log("Proyecto creado correctamente");
        // Emitir el evento al cliente con Socket.IO
        const io = obtenerSocketServer();
        if (io) {
            io.emit('proyecto-creado', proyectoData);
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }
        return res.status(200).json({ message: 'Proyecto creado correctamente', data: resultado });
    } catch (error) {
        console.error('Error en CrearProyectoController => ', error);
        return res.status(500).json({ error: `Error al crear proyecto => ${error}` });
    }
};
module.exports = {
    CrearProyectoController
};