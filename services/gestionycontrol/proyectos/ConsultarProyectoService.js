const { ConsultarProyectosQuery, ConsultarProyectosPaginadoQuery } = require('../../../queries/gestionycontrol/proyectos/ConsultarProyectoQuery');

const ConsultarProyectosService = async () => {
    return await ConsultarProyectosQuery();
};

const ConsultarProyectosPaginadoService = async (paginacion) => {
    return ConsultarProyectosPaginadoQuery(paginacion);
};
module.exports = {
    ConsultarProyectosService,
    ConsultarProyectosPaginadoService
};