const { VerBodegasQuery, VerBodegasPaginadoQuery } = require('../../../queries/gestionycontrol/bodegas/VerBodegasQuery');

const VerBodegasService = async () => {
    return await VerBodegasQuery();
};

const VerBodegasPaginadoService = async (paginacion) => {
    return VerBodegasPaginadoQuery(paginacion);
};
module.exports = {
    VerBodegasService,
    VerBodegasPaginadoService
};