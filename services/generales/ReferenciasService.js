const { ListarReferenciasQuery } = require('../../queries/generales/ReferenciasQuery');

const ListarReferenciasService = async () => {
    return await ListarReferenciasQuery();
};
module.exports = {
    ListarReferenciasService
};