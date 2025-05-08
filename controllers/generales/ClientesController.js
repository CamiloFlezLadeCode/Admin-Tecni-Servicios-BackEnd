const { ConsultarListarClientesService } = require('../../services/generales/ClientesService');

const ConsultarListarClientesController = async (req, res) => {
    try {
        const Clientes = await ConsultarListarClientesService();
        console.log(`CLIENTES => ${JSON.stringify(Clientes)}`);
        let data = Clientes.map(cliente => ({
            Id: cliente.IdCliente,
            value: cliente.DocumentoCliente,
            label: cliente.NombreCliente
        }));
        
        res.json(data);
    } catch (error) {
        console.error('Error en ConsultarListarClientesController:', error);
        res.status(500).json({error: 'Error al listar los clientes'});
    }
};
module.exports = {
    ConsultarListarClientesController
};