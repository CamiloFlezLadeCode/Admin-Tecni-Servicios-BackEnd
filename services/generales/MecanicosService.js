const { ListarMecanicosQuery } = require('../../queries/generales/MecanicosQuery');

const ListarMecanicosService = async () => {
    return await ListarMecanicosQuery();
};
module.exports = {
    ListarMecanicosService
};