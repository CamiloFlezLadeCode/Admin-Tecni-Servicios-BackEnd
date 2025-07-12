const { EliminarOrdenDeServicioQuery } = require('../../../queries/comercial/ordenes_de_servicio/EliminarOrdenDeServicioQuery');

const EliminarOrdenDeServicioService = async () => {
    return await EliminarOrdenDeServicioQuery();
};
module.exports = {
    EliminarOrdenDeServicioService
};