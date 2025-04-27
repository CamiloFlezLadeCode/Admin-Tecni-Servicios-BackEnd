const { obtenerClientes, insertarCliente, obtenerClientePorDocumento, crearClienteCompleto } = require('../../bd/gestionycontrol/clientesQueries');

const verClientesService = async() => {
    return await obtenerClientes();
}

const insertarClienteService = async(clienteData) => {
    return await insertarCliente(clienteData);
}

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