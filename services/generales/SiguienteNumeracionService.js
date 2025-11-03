const { SiguienteNumeracion_Para_EntradaRepuestosQuery } = require('../../queries/generales/SiguienteNumeracionQuery');

const SiguienteNumeracion_Para_EntradaRepuestosService = async () => {
    return await SiguienteNumeracion_Para_EntradaRepuestosQuery();
};
module.exports = {
    SiguienteNumeracion_Para_EntradaRepuestosService
};