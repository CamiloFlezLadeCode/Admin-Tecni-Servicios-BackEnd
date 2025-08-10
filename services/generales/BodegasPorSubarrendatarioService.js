const { ListarBodegasPorSubarrendatarioQuery } = require('../../queries/generales/BodegasPorSubarrendatarioQuery');

const ListarBodegasPorSubarrendatarioService = async (DocumentoSubarrendatario) => {
    return await ListarBodegasPorSubarrendatarioQuery(DocumentoSubarrendatario);
};
module.exports = {
    ListarBodegasPorSubarrendatarioService
};