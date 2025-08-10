const { ListarTipoEquipoQuery } = require('../../queries/generales/TipoEquipoQuery');

const ListarTipoEquipoService = async () => {
    return await ListarTipoEquipoQuery();
};
module.exports = {
    ListarTipoEquipoService
};