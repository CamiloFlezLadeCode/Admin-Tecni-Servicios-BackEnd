const { leerPaginacion } = require('../../../utils/paginacion');
const { ConsultarMecanicosService, ConsultarMecanicosPaginadoService } = require('../../../services/gestionycontrol/mecanicos/ConsultarMecanicosService');

const ConsultarMecanicosController = async (req, res) => {
    try {
        // Con `pagina` responde paginado; sin ella, el listado completo de siempre.
        const paginacion = leerPaginacion(req.query);
        if (paginacion) {
            return res.status(200).json(await ConsultarMecanicosPaginadoService(paginacion));
        }
        const Mecanicos = await ConsultarMecanicosService();
// console.log(`Mecánicos obtenidos correctamente. Total: ${Mecanicos.length}`);
        return res.status(200).json(Mecanicos);
    } catch (error) {
        console.error('Error en ConsultarMecanicosController => ', error);
        return res.status(500).json({ error: `Error al crear equipo => ${error}` });
    }
};
module.exports = {
    ConsultarMecanicosController
};