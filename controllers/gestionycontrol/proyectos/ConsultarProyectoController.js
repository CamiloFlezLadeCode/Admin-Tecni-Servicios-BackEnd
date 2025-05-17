const { ConsultarProyectosService } = require('../../../services/gestionycontrol/proyectos/ConsultarProyectoService');

const ConsultarProyectosController = async (req, res) => {
    try {
        const Proyectos = await ConsultarProyectosService();
        console.log(`Proyectos obtenidos correctamente. Total: ${Proyectos.length}`);
        res.status(200).json(Proyectos);
    } catch (error) {
        console.error('Error en ConsultarProyectosController => ', error);
        res.status(500).json({ error: `Error al consultar proyectos => ${error}` });
    }
};
module.exports = {
    ConsultarProyectosController
};