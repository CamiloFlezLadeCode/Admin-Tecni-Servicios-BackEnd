const { VerEstadoDeCuentaQuery, VerEstadoDeCuentaPaginadoQuery } = require('../../../queries/comercial/estado_de_cuenta/VerEstadoDeCuentaQuery');

const VerEstadoDeCuentaService = async (DocumentoCliente) => {
    return await VerEstadoDeCuentaQuery(DocumentoCliente);
};
const VerEstadoDeCuentaPaginadoService = async (DocumentoCliente, paginacion, filtros) => {
    return VerEstadoDeCuentaPaginadoQuery(DocumentoCliente, paginacion, filtros);
};

module.exports = {
    VerEstadoDeCuentaService,
    VerEstadoDeCuentaPaginadoService
};