const { VerRemisionPorIdQuery } = require('../../../queries/comercial/remisiones/VerRemisionPorIdQuery');

const VerRemisionPorIdService = async (IdRemision) => {
    return await VerRemisionPorIdQuery(IdRemision);
};

module.exports = {
    VerRemisionPorIdService
};
