const { CrearRepuestoQuery } = require('../../../queries/gestionycontrol/repuestos/CrearRepuestoQuery');

const CrearRepuestoService = async (DatosRepuesto) => {
    return await CrearRepuestoQuery(DatosRepuesto);
};
module.exports = {
    CrearRepuestoService
};