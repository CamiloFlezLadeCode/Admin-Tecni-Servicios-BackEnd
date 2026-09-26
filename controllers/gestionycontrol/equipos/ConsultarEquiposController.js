const { leerPaginacion } = require('../../../utils/paginacion');
const { ConsultarEquiposService, ConsultarEquiposPaginadoService } = require('../../../services/gestionycontrol/equipos/ConsultarEquiposService');

const ConsultarEquiposController = async (req, res) => {
    try {
        // Con `pagina` responde paginado; sin ella, el listado completo de siempre.
        const paginacion = leerPaginacion(req.query);
        if (paginacion) {
            return res.status(200).json(await ConsultarEquiposPaginadoService(paginacion));
        }
        const Equipos = await ConsultarEquiposService();
// console.log(`Equipos obtenidos correctamente. Total: ${Equipos.length}`);
        return res.status(200).json(Equipos);
    } catch (error) {
        console.error('Error en TraerEquiposController => ', error);
        return res.status(500).json({ error: `Error al crear equipo => ${error}` });
    }
};
module.exports = {
    ConsultarEquiposController
};