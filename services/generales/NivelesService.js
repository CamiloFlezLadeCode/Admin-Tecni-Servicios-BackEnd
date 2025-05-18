const { ListarNivelesQuery } = require('../../queries/generales/NivelesQuery');

const ListarNivelesService = async () => {
    return await ListarNivelesQuery();
};
module.exports = {
    ListarNivelesService
};