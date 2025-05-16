const { ListarEquiposQuery } = require('../../queries/generales/EquiposQuery');

const ListarEquiposService = async (referencia) => {
    return await ListarEquiposQuery(referencia);
};
module.exports = {
    ListarEquiposService
};