const { ActualizarProyectoQuery } = require('../../../queries/gestionycontrol/proyectos/ActualizarProyectoQuery');

const ActualizarProyectoService = async (DatosProyecto) => {
    return await ActualizarProyectoQuery(DatosProyecto);
};
module.exports = {
    ActualizarProyectoService
};