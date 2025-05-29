const { ListarBodeguerosQuery } = require('../../queries/generales/BodeguerosQuery');

const ListarBodeguerosService = async () => {
    return await ListarBodeguerosQuery();
};
module.exports = {
    ListarBodeguerosService
};