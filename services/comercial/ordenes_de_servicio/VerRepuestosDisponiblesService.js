const { VerRepuestosDisponiblesQuery } = require('../../../queries/comercial/ordenes_de_servicio/VerRepuestosDisponiblesQuery');

const VerRepuestosDisponiblesService = async (ParametrosDeBusqueda) => {
    return await VerRepuestosDisponiblesQuery(ParametrosDeBusqueda);
};
module.exports = {
    VerRepuestosDisponiblesService
};