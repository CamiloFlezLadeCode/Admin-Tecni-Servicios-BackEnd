const { ConsultarRepuestosQuery } = require('../../../queries/gestionycontrol/repuestos/ConsultarRepuestosQuery');

const ConsultarRepuestosService = async () => {
    return await ConsultarRepuestosQuery();
};
module.exports = {
    ConsultarRepuestosService
};