const { VerDevolucionPorIdQuery } = require('../../../queries/comercial/devoluciones/VerDevolucionPorIdQuery');

const VerDevolucionPorIdService = async (IdDevolucion) => {
    return await VerDevolucionPorIdQuery(IdDevolucion);
};

module.exports = {
    VerDevolucionPorIdService
};

