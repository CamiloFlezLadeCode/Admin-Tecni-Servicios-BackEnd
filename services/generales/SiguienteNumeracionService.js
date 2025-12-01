const { SiguienteNumeracion_Para_EntradaRepuestosQuery, SiguienteNumeracion_Para_SalidaRepuestosQuery } = require('../../queries/generales/SiguienteNumeracionQuery');

const SiguienteNumeracion_Para_EntradaRepuestosService = async () => {
    return await SiguienteNumeracion_Para_EntradaRepuestosQuery();
};
module.exports = {
    SiguienteNumeracion_Para_EntradaRepuestosService
};

const SiguienteNumeracion_Para_SalidaRepuestosService = async () => {
    return await SiguienteNumeracion_Para_SalidaRepuestosQuery();
};
module.exports.SiguienteNumeracion_Para_SalidaRepuestosService = SiguienteNumeracion_Para_SalidaRepuestosService;