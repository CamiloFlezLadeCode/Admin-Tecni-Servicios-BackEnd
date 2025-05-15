const { ListarProyectosQuery } = require('../../queries/generales/ProyectosQuery');

const ListarProyectosService = async () => {
    return await ListarProyectosQuery();
};
module.exports = {
    ListarProyectosService
};