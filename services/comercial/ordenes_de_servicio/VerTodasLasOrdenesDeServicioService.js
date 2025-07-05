const { VerTodasLasOrdenesDeServicioQuery } = require('../../../queries/comercial/ordenes_de_servicio/VerTodasLasOrdenesDeServicioQuery');

const VerTodasLasOrdenesDeServicioService = async () => {
    return await VerTodasLasOrdenesDeServicioQuery();
};
module.exports = {
    VerTodasLasOrdenesDeServicioService
};