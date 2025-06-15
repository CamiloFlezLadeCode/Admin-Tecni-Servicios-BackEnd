const { ActualizarContrasenaQuery } = require('../../../queries/gestionycontrol/ajustes/ActualizarContrasenaQuery');

const ActualizarContrasenaService = async (DatosCredenciales) => {
    return await ActualizarContrasenaQuery(DatosCredenciales);
};
module.exports = {
    ActualizarContrasenaService
};