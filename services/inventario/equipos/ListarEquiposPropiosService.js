const { ListarEquiposPropiosQuery } = require('../../../queries/inventario/equipos/ListarEquiposPropiosQuery');

const ListarEquiposPropiosService = async () => {
    return await ListarEquiposPropiosQuery();
};
module.exports = {
    ListarEquiposPropiosService
};