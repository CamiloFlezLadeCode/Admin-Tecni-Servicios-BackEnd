const { CrearRemisionQuery } = require('../../../queries/comercial/remisiones/CrearRemisionQuery');

const CrearRemisionService = async (DatosRemision) => {
    return await CrearRemisionQuery(DatosRemision);
};
module.exports = {
    CrearRemisionService
};