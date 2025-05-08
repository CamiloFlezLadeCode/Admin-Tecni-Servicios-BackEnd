const { CrearProyectoQuery } = require('../../../queries/gestionycontrol/proyectos/CrearProyectoQuery');

const CrearProyectoService = async (proyectoData) => {
    return await CrearProyectoQuery(proyectoData);
};
module.exports = {
    CrearProyectoService
}