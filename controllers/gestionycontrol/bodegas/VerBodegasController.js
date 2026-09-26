const { leerPaginacion } = require('../../../utils/paginacion');
const { VerBodegasService, VerBodegasPaginadoService } = require('../../../services/gestionycontrol/bodegas/VerBodegasService');

const VerBodegasController = async (req, res) => {
    try {
        // Con `pagina` responde paginado; sin ella, el listado completo de siempre.
        const paginacion = leerPaginacion(req.query);
        if (paginacion) {
            return res.status(200).json(await VerBodegasPaginadoService(paginacion));
        }
        const Bodegas = await VerBodegasService();
// console.log(`BODEGAS OBTENIDAS CORRECTAMENTE. TOTAL: ${Bodegas.length}`);
        return res.status(200).json(Bodegas);
    } catch (error) {
        console.error('Error en VerBodegasController => ', error.message);
        return res.status(500).json({ error: `Error al consultar las bodegas => ${error.message}` });
    }
};
module.exports = {
    VerBodegasController
};