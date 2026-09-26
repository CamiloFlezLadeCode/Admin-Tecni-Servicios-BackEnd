const { leerPaginacion } = require('../../../utils/paginacion');
const { VerTodasLasDevolucionesService, VerTodasLasDevolucionesPaginadoService } = require('../../../services/comercial/devoluciones/VerTodasLasDevolucionesService');

const VerTodasLasDevolucionesController = async (req, res) => {
    try {
        // Con `pagina` responde paginado; sin ella, el listado completo de siempre.
        const paginacion = leerPaginacion(req.query);
        if (paginacion) {
            return res.status(200).json(await VerTodasLasDevolucionesPaginadoService(paginacion));
        }
        const Devoluciones = await VerTodasLasDevolucionesService();
// console.log(`Todas las devoluciones se obtuvieron correctemante. Total: ${Devoluciones.length}`);
        return res.status(200).json(Devoluciones);
    } catch (error) {
        console.error('Error en VerTodasLasDevolucionesController => ', error.message);
        return res.status(500).json({ error: `Error al cargar todas las devoluciones => ${error.message}` });
    }
};
module.exports = {
    VerTodasLasDevolucionesController
};