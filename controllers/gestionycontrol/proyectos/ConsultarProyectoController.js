const { leerPaginacion } = require('../../../utils/paginacion');
const { ConsultarProyectosService, ConsultarProyectosPaginadoService } = require('../../../services/gestionycontrol/proyectos/ConsultarProyectoService');

const ConsultarProyectosController = async (req, res) => {
    try {
        // Con `pagina` responde paginado; sin ella, el listado completo de siempre.
        const paginacion = leerPaginacion(req.query);
        if (paginacion) {
            return res.status(200).json(await ConsultarProyectosPaginadoService(paginacion));
        }
        const Proyectos = await ConsultarProyectosService();
// console.log(`Proyectos obtenidos correctamente. Total: ${Proyectos.length}`);
        return res.status(200).json(Proyectos);
    } catch (error) {
        console.error('Error en ConsultarProyectosController => ', error);
        return res.status(500).json({ error: `Error al consultar proyectos => ${error}` });
    }
};
module.exports = {
    ConsultarProyectosController
};