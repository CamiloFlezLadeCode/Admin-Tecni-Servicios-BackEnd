const { ConsultarRepuestoPorIdQuery } = require('../../../queries/gestionycontrol/repuestos/ConsultarRepuestoPorIdQuery');

const ConsultarRepuestoPorIdService = async (IdRepuesto) => {
    return await ConsultarRepuestoPorIdQuery(IdRepuesto);
};
module.exports = {
    ConsultarRepuestoPorIdService
};