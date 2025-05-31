const { VerCantidadDisponibleQuery } = require('../../../queries/comercial/remisiones/VerCantidadDisponibleQuery');

const VerCantidadDisponibleService = async (IdEquipo) => {
    return await VerCantidadDisponibleQuery(IdEquipo);
};
module.exports = {
    VerCantidadDisponibleService
};