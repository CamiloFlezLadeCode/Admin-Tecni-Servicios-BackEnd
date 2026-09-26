const { leerPaginacion } = require('../../../utils/paginacion');
const { ConsultarRemisionesService, ConsultarRemisionesPaginadoService } = require('../../../services/comercial/remisiones/ConsultarRemisionesService');

const ConsultarRemisionesController = async (req, res) => {
    try {
        // Con `pagina` responde paginado; sin ella, el listado completo de siempre.
        const paginacion = leerPaginacion(req.query);
        if (paginacion) {
            return res.status(200).json(await ConsultarRemisionesPaginadoService(paginacion));
        }
        const Remisiones = await ConsultarRemisionesService();
// console.log(`Remisiones consultadas correctamente. Total: ${Remisiones.length}`);
        return res.status(200).json(
            Remisiones
        );
    } catch (error) {
        console.error('Error en ConsultarRemisionesController => ', error);
        return res.status(500).json({ error: `Error al consultar las remisiones => ${error}` });
    }
};
module.exports = {
    ConsultarRemisionesController
};