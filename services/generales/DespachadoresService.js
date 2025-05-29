const { ListarDespachadoresQuery } = require('../../queries/generales/DespachadoresQuery');

const ListarDespachadoresService = async () => {
    return await ListarDespachadoresQuery();
};
module.exports = {
    ListarDespachadoresService
};