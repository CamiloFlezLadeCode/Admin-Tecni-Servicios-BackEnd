const { VerTodasLasDevolucionesQuery, VerTodasLasDevolucionesPaginadoQuery } = require('../../../queries/comercial/devoluciones/VerTodasLasDevolucionesQuery');

const VerTodasLasDevolucionesService = async () => {
    return await VerTodasLasDevolucionesQuery();
};

const VerTodasLasDevolucionesPaginadoService = async (paginacion) => {
    return VerTodasLasDevolucionesPaginadoQuery(paginacion);
};
module.exports = {
    VerTodasLasDevolucionesService,
    VerTodasLasDevolucionesPaginadoService
};