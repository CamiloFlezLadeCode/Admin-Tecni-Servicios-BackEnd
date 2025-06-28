// const { ActualizarUsuarioGeneralService } = require('../../../services/gestionycontrol/usuariosgenerales/ActualizarUsuarioGeneralService');
// const { wss } = require('../../../server');
// const { obtenerWebSocketServer } = require('../../../utils/WebSocket');
// const WebSocket = require('ws');


// const ActualizarUsuarioGeneralController = async (req, res) => {
//     try {
//         const DatosAActualizarUsuarioGeneral = req.body;
//         await ActualizarUsuarioGeneralService(DatosAActualizarUsuarioGeneral);
//         console.log("✅ Usuario general actualizado correctamente");
//         //Emitir el mensaje a todos los clientes WebSocket
//         // const Mensaje = {
//         //     tipo: 'usuario-actualizado',
//         //     data: DatosAActualizarUsuarioGeneral,
//         // };
//         // wss.clients.forEach((cliente) => {
//         //     if (cliente.readyState === WebSocket.OPEN) {
//         //         cliente.send(JSON.stringify(Mensaje));
//         //     }
//         // });
//         const wss = obtenerWebSocketServer();
//         if (wss) {
//             const mensaje = {
//                 tipo: 'usuario-actualizado',
//                 // data: DatosAActualizarUsuarioGeneral,
//             };

//             wss.clients.forEach((cliente) => {
//                 if (cliente.readyState === WebSocket.OPEN) {
//                     cliente.send(JSON.stringify(mensaje));
//                 }
//             });
//         } else {
//             console.warn("⚠️ WebSocket server no inicializado");
//         }
//         res.status(204).send(); //Se envía confirmación de exito al cliente, sin cuerpo. Únicamente confirmación
//     } catch (error) {
//         console.error('Error en ActualizarUsuarioGeneralController => ', error);
//         res.status(500).json({ error: `Error al crear equipo => error` });
//     }
// };
// module.exports = {
//     ActualizarUsuarioGeneralController
// };




const { ActualizarUsuarioGeneralService } = require('../../../services/gestionycontrol/usuariosgenerales/ActualizarUsuarioGeneralService');
const { obtenerSocketServer } = require('../../../utils/WebSocket'); // debes tener este helper para acceder a io

const ActualizarUsuarioGeneralController = async (req, res) => {
    try {
        const DatosAActualizarUsuarioGeneral = req.body;

        await ActualizarUsuarioGeneralService(DatosAActualizarUsuarioGeneral);
        console.log("✅ Usuario general actualizado correctamente");

        // Emitir evento con Socket.IO
        const io = obtenerSocketServer();
        if (io) {
            io.emit('usuario-actualizado', DatosAActualizarUsuarioGeneral);
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }
        return res.status(204).send(); // No Content
    } catch (error) {
        console.error('Error en ActualizarUsuarioGeneralController => ', error);
        return res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};

module.exports = {
    ActualizarUsuarioGeneralController
};
