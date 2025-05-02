const { obtenerClientes, insertarClienteQuery, obtenerClientePorDocumento, crearClienteCompleto } = require('../../../queries/gestionycontrol/clientes/clientesQueries');

const verClientesService = async() => {
    return await obtenerClientes();
}

// const insertarClienteService = async(clienteData) => {
//     return await insertarCliente(clienteData);
// }

const insertarClienteService = async(clienteData) => {
    // Primero insertar usuario
    await insertarUsuario(clienteData);

    // Luego insertar cliente con usuario creador
    const documento = clienteData.Identificacion;
    const usuarioCreacion = clienteData.UsuarioCreacion;

    return await insertarClienteQuery(documento, usuarioCreacion);
};

const obtenerClientePorDocumentoService = async(clienteData) => {
    return await obtenerClientePorDocumento(clienteData);
}

const crearClienteCompletoService = async (clienteData) => {
    return await crearClienteCompleto(clienteData);
}

module.exports = {
    verClientesService,
    insertarClienteService,
    obtenerClientePorDocumentoService,
    crearClienteCompletoService
}