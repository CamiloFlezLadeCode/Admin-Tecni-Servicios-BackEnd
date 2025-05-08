const { ConsultarListarClientesQuery } = require('../../queries/generales/ClientesQuery');

const ConsultarListarClientesService = async () => {
    return await ConsultarListarClientesQuery();
};
module.exports = {
    ConsultarListarClientesService
};