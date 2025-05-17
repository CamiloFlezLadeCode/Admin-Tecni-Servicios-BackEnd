const { verClientesService, insertarClienteService, obtenerClientePorDocumentoService, crearClienteCompletoService } = require('../../../services/gestionycontrol/clientes/clientesService');

const verClientes = async(req, res) => {
    try {
        const clientes = await verClientesService();
        console.log(`Clientes obtenidos correctamente. Total: ${clientes.length}`);
        res.json(clientes);
    } catch (error) {
        console.error('Error en verClientes:', error);
        res.status(500).json({error: 'Error al ver los clientes'});
    }
};

const insertarCliente = async (req, res) => {
    try {
        const clienteData = req.body;

        if (!clienteData.UsuarioCreacion) {
            return res.status(400).json({ error: 'UsuarioCreacion es requerido' });
        }

        const resultado = await insertarClienteService(clienteData);
        res.json({ message: 'Cliente insertado correctamente', data: resultado });
    } catch (error) {
        console.error('Error en insertarCliente:', error);
        res.status(500).json({ error: 'Error al insertar el cliente' });
    }
};

// const obtenerClientePorDocumento = async (req, res) => {
//     try {
//         // const clienteData = req.body; //Para POST
//         const clienteData = {
//             Identificacion: req.params.DocumentoUsuario
//         };
//         const cliente = await obtenerClientePorDocumentoService(clienteData);

//         // if (cliente.length > 0) {
//         //     // Si se encontró el cliente, devolverlo
//         //     res.status(200).json({
//         //         mensaje: "Cliente encontrado",
//         //         cliente: cliente
//         //     });
//         // } else {
//         //     // Si no se encontró el cliente
//         //     res.status(200).json({
//         //         mensaje: "Cliente no encontrado"
//         //     });
//         // }

//         if (cliente.length > 0) {
//             res.status(200).json({
//                 encontrado: true,
//                 cliente: cliente
//             });
//         } else {
//             res.status(200).json({
//                 encontrado: false,
//                 mensaje: "Cliente no encontrado"
//             });
//         }
//     } catch (error) {
//         // Manejo de errores
//         console.error(error);
//         res.status(500).json({
//             mensaje: "Error en la consulta",
//             error: error.message
//         });
//     }
// };
const obtenerClientePorDocumento = async (req, res) => {
    try {
        // Obtención de la identificación del cliente desde los parámetros de la URL
        const DocumentoUsuario = req.params.DocumentoUsuario;
        
        // Llamada al servicio para obtener el cliente por documento
        const cliente = await obtenerClientePorDocumentoService(DocumentoUsuario);

        // Verificación de la existencia del cliente
        if (cliente && cliente.length > 0) {
            res.status(200).json({
                encontrado: true,
                cliente: cliente[0] // Asumiendo que `cliente` es un arreglo y tomamos el primer resultado
            });
        } else {
            res.status(200).json({
                encontrado: false,
                mensaje: "Cliente no encontrado"
            });
        }
        console.log(cliente);
    } catch (error) {
        // Manejo de errores con más detalles
        console.error('Error al obtener el cliente:', error);
        res.status(500).json({
            mensaje: "Error en la consulta al obtener el cliente",
            error: error.message
        });
    }
};

const crearClienteCompleto = async (req, res) => {
    try {
        const clienteData = req.body; // Captura los datos que vienen del Frontend

        const nuevoCliente = await crearClienteCompletoService(clienteData);

        res.status(201).json({
            ok: true,
            message: 'Cliente creado exitosamente',
            data: nuevoCliente
        });
    } catch (error) {
        console.error('❌ Error en crearClienteCompleto:', error);
        res.status(500).json({
            ok: false,
            message: 'Error al crear cliente',
            error: error.message
        });
    }
};

module.exports = {
    verClientes,
    insertarCliente,
    obtenerClientePorDocumento,
    crearClienteCompleto
};