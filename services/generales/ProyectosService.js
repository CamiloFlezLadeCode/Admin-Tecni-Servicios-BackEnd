const { ListarProyectosQuery } = require('../../queries/generales/ProyectosQuery');

const ListarProyectosService = async (proyectosDeCliente) => {
    return await ListarProyectosQuery(proyectosDeCliente);
};
module.exports = {
    ListarProyectosService
};