const { ConsultarTiposDeDocumentosQuery } = require('../../queries/generales/TipoDocumentoQuery');

const ConsultarTiposDeDocumentosService = async () => {
    return await ConsultarTiposDeDocumentosQuery();
};
module.exports = {
    ConsultarTiposDeDocumentosService
};