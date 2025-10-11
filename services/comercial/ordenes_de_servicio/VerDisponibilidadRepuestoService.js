const { VerDisponiblidadRepuestoQuery } = require('../../../queries/comercial/ordenes_de_servicio/VerDisponibilidadRepuestoQuery');

const VerDisponibilidadRepuestoService = async (ParametrosBusquedaCantidadRepuestoDisponible) => {
    return await VerDisponiblidadRepuestoQuery(ParametrosBusquedaCantidadRepuestoDisponible);
};
module.exports = {
    VerDisponibilidadRepuestoService
};