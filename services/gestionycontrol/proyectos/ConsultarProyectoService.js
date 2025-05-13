const { ConsultarProyectosQuery } = require('../../../queries/gestionycontrol/proyectos/ConsultarProyectoQuery');

const ConsultarProyectosService = async () => {
    return await ConsultarProyectosQuery();
};
module.exports = {
    ConsultarProyectosService
};