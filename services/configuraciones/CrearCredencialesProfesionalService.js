const { CrearCredencialesProfesionalQuery } = require('../../queries/configuraciones/CrearCredencialesProfesionalQuery');

const CrearCredencialesProfesionalService = async (DatosCredenciales) => {
    return await CrearCredencialesProfesionalQuery(DatosCredenciales);
};
module.exports = {
    CrearCredencialesProfesionalService
};