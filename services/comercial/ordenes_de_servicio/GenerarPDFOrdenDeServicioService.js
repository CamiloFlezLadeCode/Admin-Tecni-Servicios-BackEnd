const { GenerarPDFOrdenDeServicioQuery } = require('../../../queries/comercial/ordenes_de_servicio/GenerarPDFOrdenDeServicioQuery');

const GenerarPDFOrdenDeServicioService = async (IdOrdenDeServicio) => {
    return await GenerarPDFOrdenDeServicioQuery(IdOrdenDeServicio);
};
module.exports = {
    GenerarPDFOrdenDeServicioService
};