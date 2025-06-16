const { ConsultarCredencialesDelProfesionalQuery } = require('../../queries/configuraciones/ConsultarCredencialesDelProfesionalQuery');

const ConsultarCredencialesDelProfesionalService = async (DocumentoProfesional) => {
    return await ConsultarCredencialesDelProfesionalQuery(DocumentoProfesional);
};
module.exports = {
    ConsultarCredencialesDelProfesionalService
};