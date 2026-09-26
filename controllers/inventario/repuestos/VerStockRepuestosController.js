const { leerPaginacion } = require('../../../utils/paginacion');
const { VerStockRepuestosService, VerStockRepuestosPaginadoService } = require('../../../services/inventario/repuestos/VerStockRepuestosService');

const VerStockRepuestosController = async (req, res) => {
    try {
        // Con `pagina` responde paginado; sin ella, el listado completo de siempre.
        const paginacion = leerPaginacion(req.query);
        if (paginacion) {
            const filtros = {
                SoloBajoStock: req.query.SoloBajoStock === 'true' || req.query.SoloBajoStock === '1',
            };
            return res.status(200).json(await VerStockRepuestosPaginadoService(paginacion, filtros));
        }
        const RepuestosStock = await VerStockRepuestosService();
// console.log(`Stock de repuestos obtenido correctamente. Total: ${RepuestosStock.length}`);
        return res.status(200).json(RepuestosStock);
    } catch (error) {
        console.error('Error en VerStockRepuestosController => ', error.message);
        return res.status(500).json({ error: `Error al consultar el stock de repuestos => ${error.message}` });
    }
};
module.exports = {
    VerStockRepuestosController
};