const { ListarEstadosQuery } = require('../../queries/generales/EstadosQuery');

const ListarEstadosService = async () => {
    return await ListarEstadosQuery();
};
module.exports = {
    ListarEstadosService
};