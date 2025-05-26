const { ConsultarVehiculosQuery } = require('../../../queries/gestionycontrol/vehiculos/ConsultarVehiculosQuery');

const ConsultarVehiculosService = async () => {
    return await ConsultarVehiculosQuery();
};
module.exports = {
    ConsultarVehiculosService
};