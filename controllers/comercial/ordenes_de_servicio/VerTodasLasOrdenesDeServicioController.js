const { leerPaginacion } = require('../../../utils/paginacion');
const { VerTodasLasOrdenesDeServicioService, VerTodasLasOrdenesDeServicioPaginadoService } = require('../../../services/comercial/ordenes_de_servicio/VerTodasLasOrdenesDeServicioService');

const VerTodasLasOrdenesDeServicioController = async (req, res) => {
    try {
        // Con `pagina` responde paginado; sin ella, el listado completo de siempre.
        const paginacion = leerPaginacion(req.query);
        if (paginacion) {
            return res.status(200).json(await VerTodasLasOrdenesDeServicioPaginadoService(paginacion));
        }
        const OrdenesDeServicio = await VerTodasLasOrdenesDeServicioService();
// console.log(`Ordenes de servicio obtenidas correctamente. Total: ${OrdenesDeServicio.length}`);
        return res.status(200).json(OrdenesDeServicio);
    } catch (error) {
        console.error('Error en VerTodasLasOrdenesDeServicioController => ', error.message);
        return res.status(500).json({ error: `Error al consultar las ordenes de servicio => ${error.message}` });
    }
};
module.exports = {
    VerTodasLasOrdenesDeServicioController
};