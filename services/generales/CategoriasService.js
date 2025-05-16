const { ListarCategoriasQuery } = require('../../queries/generales/CategoriasQuery');

const ListarCategoriasService = async () => {
    return await ListarCategoriasQuery();
};
module.exports = {
    ListarCategoriasService
};