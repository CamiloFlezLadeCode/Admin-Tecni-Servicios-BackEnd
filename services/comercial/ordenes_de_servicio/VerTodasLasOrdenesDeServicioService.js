const { VerTodasLasOrdenesDeServicioQuery, VerTodasLasOrdenesDeServicioPaginadoQuery } = require('../../../queries/comercial/ordenes_de_servicio/VerTodasLasOrdenesDeServicioQuery');

const VerTodasLasOrdenesDeServicioService = async () => {
    return await VerTodasLasOrdenesDeServicioQuery();
};

const VerTodasLasOrdenesDeServicioPaginadoService = async (paginacion) => {
    return VerTodasLasOrdenesDeServicioPaginadoQuery(paginacion);
};
module.exports = {
    VerTodasLasOrdenesDeServicioService,
    VerTodasLasOrdenesDeServicioPaginadoService
};