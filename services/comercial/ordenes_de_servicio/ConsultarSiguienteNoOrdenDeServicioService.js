const { ConsultarSiguienteNoOrdenDeServicioQuery } = require('../../../queries/comercial/ordenes_de_servicio/ConsultarSiguienteNoOrdenDeServicioQuery');

const ConsultarSiguienteNoOrdenDeServicioService = async () => {
    return await ConsultarSiguienteNoOrdenDeServicioQuery();
};
module.exports = {
    ConsultarSiguienteNoOrdenDeServicioService
};