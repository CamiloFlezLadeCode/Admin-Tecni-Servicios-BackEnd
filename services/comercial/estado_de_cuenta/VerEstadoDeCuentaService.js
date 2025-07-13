const { VerEstadoDeCuentaQuery } = require('../../../queries/comercial/estado_de_cuenta/VerEstadoDeCuentaQuery');

const VerEstadoDeCuentaService = async (DocumentoCliente) => {
    return await VerEstadoDeCuentaQuery(DocumentoCliente);
};
module.exports = {
    VerEstadoDeCuentaService
};