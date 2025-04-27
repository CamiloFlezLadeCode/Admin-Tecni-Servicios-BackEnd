const { obtenerClientes, insertarCliente } = require('../../bd/gestionycontrol/clientesQueries');

const verClientesService = async() => {
    return await obtenerClientes();
}

const insertarClienteService = async(clienteData) => {
    return await insertarCliente(clienteData);
}

module.exports = {
    verClientesService,
    insertarClienteService
}