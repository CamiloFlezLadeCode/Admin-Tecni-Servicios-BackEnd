const { CrearDevolucionQuery } = require('../../../queries/comercial/devoluciones/CrearDevolucionQuery');

const CrearDevolucionService = async () => {
    return await CrearDevolucionQuery();
};
module.exports = {
    CrearDevolucionService
};