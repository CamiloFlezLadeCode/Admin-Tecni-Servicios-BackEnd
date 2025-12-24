// const { ActualizarEquipoService } = require('../../../services/gestionycontrol/equipos/ActualizarEquipoService');
// const { obtenerSocketServer } = require('../../../utils/WebSocket'); // debes tener este helper para acceder a io

// const ActualizarEquipoController = async (req, res) => {
//     try {
//         const DatosEquipoAActualizar = req.body;
//         await ActualizarEquipoService(DatosEquipoAActualizar);
//         console.log(`Equipo actualizado correctamente.`);
//         //Se emite evento Socket.IO
//         const io = obtenerSocketServer();
//         if (io) {
//             io.emit('equipo-actualizado', DatosEquipoAActualizar);
//         } else {
//             console.warn("⚠️ Socket.IO no está inicializado");
//         }
//         //...
//         return res.status(204).send();
//     } catch (error) {
//         console.error('Error en ActualizarEquipoController => ', error);
//         return res.status(500).json({ error: `Error al crear equipo => error` });
//     }
// };
// module.exports = {
//     ActualizarEquipoController
// };

const { ActualizarEquipoService } = require('../../../services/gestionycontrol/equipos/ActualizarEquipoService');
const { obtenerSocketServer } = require('../../../utils/WebSocket');

const ActualizarEquipoController = async (req, res) => {
    try {
        const DatosEquipoAActualizar = req.body;
        
        const equipoActualizado = await ActualizarEquipoService(DatosEquipoAActualizar);

        console.log(`Equipo actualizado correctamente.`);

        // Emitir evento Socket.IO con los datos actualizados
        const io = obtenerSocketServer();
        if (io) {
            io.emit('equipo-actualizado', equipoActualizado);
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }

        return res.status(200).json({
            success: true,
            message: 'Equipo actualizado correctamente',
            data: equipoActualizado
        });
    } catch (error) {
        console.error('Error en ActualizarEquipoController:', error);
        return res.status(500).json({
            success: false,
            error: 'Error al actualizar equipo',
            details: error.message
        });
    }
};

module.exports = {
    ActualizarEquipoController
};