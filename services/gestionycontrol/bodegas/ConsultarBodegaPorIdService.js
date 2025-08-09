const { ConsultarBodegaPorIdQuery } = require('../../../queries/gestionycontrol/bodegas/ConsultarBodegaPorIdQuery');

const ConsultarBodegaPorIdService = async (IdBodega) => {
    return await ConsultarBodegaPorIdQuery(IdBodega);
};
module.exports = {
    ConsultarBodegaPorIdService
};