// const { RegistrarUsuarioGeneralService } = require('../../../services/gestionycontrol/usuariosgenerales/CrearUsuarioGeneralService');

// const CrearUsuarioGeneralController = async (req, res) => {
//     try {
//         const DatosUsuarioGeneral = req.body;
//         if (!DatosUsuarioGeneral.UsuarioCreacion) {
//             return res.status(400).json({ error: 'UsuarioCreación es requerido' });
//         }
//         const resultado = await RegistrarUsuarioGeneralService(DatosUsuarioGeneral);
//         console.log("Usuario general creado correctamente");
//         res.status(200).json({ message: 'Usuario general creado correctamente', data: resultado });
//     } catch (error) {
//         console.error('Error en CrearUsuarioGeneralController => ', error);
//         res.status(500).json({ error: `Error al crear usuario general => error` });
//     }
// };
// module.exports = {
//     CrearUsuarioGeneralController
// };


const { RegistrarUsuarioGeneralService } = require('../../../services/gestionycontrol/usuariosgenerales/CrearUsuarioGeneralService');
const { obtenerSocketServer } = require('../../../utils/WebSocket');

const CrearUsuarioGeneralController = async (req, res) => {
    try {
        const DatosUsuarioGeneral = req.body;

        // Validación básica
        if (!DatosUsuarioGeneral.UsuarioCreacion) {
            return res.status(400).json({ error: 'UsuarioCreacion es requerido' });
        }

        // Ejecuta el servicio
        const resultado = await RegistrarUsuarioGeneralService(DatosUsuarioGeneral);

        console.log("✅ Usuario general creado correctamente");
        //Se emite el evento Socket al cliente
        const io = obtenerSocketServer();
        if (io) {
            io.emit('usuario-creado', DatosUsuarioGeneral);
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }
        //...
        return res.status(201).json({
            message: 'Usuario general creado correctamente',
            data: resultado,
        });

    } catch (error) {
        console.error('❌ Error en CrearUsuarioGeneralController =>', error);

        // Puedes diferenciar errores específicos si lo deseas
        return res.status(500).json({
            error: 'Error al crear el usuario general',
            detalle: error.message || error,
        });
    }
};

module.exports = {
    CrearUsuarioGeneralController
};
