const { ListarRolesQuery } = require('../../queries/generales/RolesQuery');

const ListarRolesService = async () => {
    return await ListarRolesQuery();
};
module.exports = {
    ListarRolesService
};