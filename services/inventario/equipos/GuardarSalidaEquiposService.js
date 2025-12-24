const { GuardarSalidaEquiposQuery } = require('../../../queries/inventario/equipos/GuardarSalidaEquiposQuery');

const GuardarSalidaEquiposService = async (DataSalidaEquipos) => {
    return await GuardarSalidaEquiposQuery(DataSalidaEquipos);
};
module.exports = {
    GuardarSalidaEquiposService
};
