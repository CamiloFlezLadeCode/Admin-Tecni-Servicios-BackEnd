const { CrearEquipoService } = require('../../../services/gestionycontrol/equipos/CrearEquipoService');
const { obtenerSocketServer } = require('../../../utils/WebSocket');

const CrearEquipoController = async (req, res) => {
    try {
        const equipoData = req.body;
        if (!equipoData.UsuarioCreacion) {
            return res.status(400).json({ error: 'UsuarioCreacion es requerido' });
        }
        const resultado = await CrearEquipoService(equipoData);
        console.log("Equipo creado correctamente");
        //Se emite el evento socket al cliente
        const io = obtenerSocketServer();
        if (io) {
            io.emit('equipo-creado', equipoData);
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }
        //...
        return res.status(200).json({ message: 'Equipo creado correctamente', data: resultado });
    } catch (error) {
        console.error('Error en CrearEquipoController => ', error);
        return res.status(500).json({ error: `Error al crear equipo => ${error}` });
    }
};
module.exports = {
    CrearEquipoController
};