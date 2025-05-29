const { ListarVehiculosQuery } = require('../../queries/generales/VehiculosQuery');

const ListarVehiculosService = async () => {
    return await ListarVehiculosQuery();
};
module.exports = {
    ListarVehiculosService
};