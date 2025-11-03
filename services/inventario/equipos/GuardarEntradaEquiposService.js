const { GuardarEntradaEquiposQuery } = require('../../../queries/inventario/equipos/GuardarEntradaEquiposQuery');

const GuardarEntradaEquiposService = async (DataEntradaEquipos) => {
    return await GuardarEntradaEquiposQuery(DataEntradaEquipos);
};
module.exports = {
    GuardarEntradaEquiposService
};