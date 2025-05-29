const { ListarTransportadoresQuery } = require('../../queries/generales/TransportadoresQuery');

const ListarTransportadoresService = async () => {
    return await ListarTransportadoresQuery();
};
module.exports = {
    ListarTransportadoresService
};