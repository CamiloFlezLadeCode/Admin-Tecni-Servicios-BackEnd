const { GuardarSalidaRepuestosQuery } = require('../../../queries/inventario/repuestos/GuardarSalidaRepuestosQuery');

const GuardarSalidaRepuestosService = async (DataSalidaRepuestos) => {
    return await GuardarSalidaRepuestosQuery(DataSalidaRepuestos);
};
module.exports = {
    GuardarSalidaRepuestosService
};