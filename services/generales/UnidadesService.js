const { ListarUnidadesQuery } = require('../../queries/generales/UnidadesQuery');

const ListarUnidadesService = async () => {
    return await ListarUnidadesQuery();
};
module.exports = {
    ListarUnidadesService
};