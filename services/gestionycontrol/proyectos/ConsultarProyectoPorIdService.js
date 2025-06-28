const { ConsultarProyectoPorIdQuery } = require('../../../queries/gestionycontrol/proyectos/ConsultarProyectoPorIdQuery');

const ConsultarProyectoPorIdService = async (IdProyecto) => {
    return await ConsultarProyectoPorIdQuery(IdProyecto);
};
module.exports = {
    ConsultarProyectoPorIdService
};