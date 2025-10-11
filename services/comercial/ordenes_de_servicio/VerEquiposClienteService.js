const { VerEquiposClienteQuery } = require('../../../queries/comercial/ordenes_de_servicio/VerEquiposClienteQuery');

const VerEquiposClienteService = async (ParametrosConsultaEquiposCliente) => {
    return await VerEquiposClienteQuery(ParametrosConsultaEquiposCliente);
};
module.exports = {
    VerEquiposClienteService
};