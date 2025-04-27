const { verClientesService, insertarClienteService } = require('../../services/gestionycontrol/clientesService');

const verClientes = async(req, res) => {
    try {
        const clientes = await verClientesService();
        console.log('CLIENTES => TODO CORRECTO...');
        console.log(clientes);
        res.json(clientes);
    } catch (error) {
        console.error('Error en verClientes:', error);
        res.status(500).json({error: 'Error al ver los clientes'});
    }
};

const insertarCliente = async (req, res) => {
    try {
        const clienteData = req.body;  // Obtén los datos del cliente desde el body de la solicitud

        console.log(clienteData);
        // return;
        const insertar = await insertarClienteService(clienteData);
        console.log("CLIENTE INSERTADO CORRECTAMENTE");
        res.json(insertar);  // Devuelve una respuesta con los resultados de la inserción
    } catch (error) {
        console.error('Error en insertarCliente:', error);
        res.status(500).json({ error: 'Error al insertar el cliente' });
    }
};

module.exports = {
    verClientes,
    insertarCliente
};