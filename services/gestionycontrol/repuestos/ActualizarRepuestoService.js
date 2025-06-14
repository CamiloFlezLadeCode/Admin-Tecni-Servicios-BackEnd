const { ActualizarRepuestoQuery } = require('../../../queries/gestionycontrol/repuestos/ActualizarRepuestoQuery');

const ActualizarRepuestoService = async (DatosRepuesto) => {
    return await ActualizarRepuestoQuery(DatosRepuesto);
};
module.exports = {
    ActualizarRepuestoService
};