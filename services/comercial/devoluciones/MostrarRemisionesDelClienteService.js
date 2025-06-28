const { MostrarRemisionesDelClienteQuery } = require('../../../queries/comercial/devoluciones/MostrarRemisionesDelClienteQuery');

const MostrarRemisionesDelClienteService = async (Datos) => {
    return await MostrarRemisionesDelClienteQuery(Datos);
};
module.exports = {
    MostrarRemisionesDelClienteService
};