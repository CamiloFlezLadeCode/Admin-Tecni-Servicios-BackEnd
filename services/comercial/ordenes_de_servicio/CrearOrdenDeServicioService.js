const { CrearOrdenDeServicioQuery } = require('../../../queries/comercial/ordenes_de_servicio/CrearOrdenDeServicioQuery');

const CrearOrdenDeServicioService = async (DatosOrdenDeServicio) => {
    return await CrearOrdenDeServicioQuery(DatosOrdenDeServicio);
};
module.exports = {
    CrearOrdenDeServicioService
};