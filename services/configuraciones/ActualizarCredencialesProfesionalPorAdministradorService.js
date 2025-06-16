const { ActualizarCredencialesProfesionalPorAdministradorQuery } = require('../../queries/configuraciones/ActualizarCredencialesProfesionalPorAdministradorQuery');

const ActualizarCredencialesProfesionalPorAdministradorService = async (DatosCredenciales) => {
    return await ActualizarCredencialesProfesionalPorAdministradorQuery(DatosCredenciales);
};
module.exports = {
    ActualizarCredencialesProfesionalPorAdministradorService
};