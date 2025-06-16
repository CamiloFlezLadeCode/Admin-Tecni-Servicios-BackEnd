const { ConsultarProfesionalesPertenecientesQuery } = require('../../queries/configuraciones/ConsultarProfesionalesPertenecientesQuery');

const ConsultarProfesionalesPertenecientesService = async () => {
    return await ConsultarProfesionalesPertenecientesQuery();
};
module.exports = {
    ConsultarProfesionalesPertenecientesService
};