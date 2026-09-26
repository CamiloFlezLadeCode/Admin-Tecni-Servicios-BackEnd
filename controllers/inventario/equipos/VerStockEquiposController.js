const { leerPaginacion } = require('../../../utils/paginacion');
const { VerStockEquiposService, VerStockEquiposPaginadoService } = require('../../../services/inventario/equipos/VerStockEquiposService');

const VerStockEquiposController = async (req, res) => {
    try {
        // Con `pagina` responde paginado; sin ella, el listado completo de siempre.
        const paginacion = leerPaginacion(req.query);
        if (paginacion) {
            const filtros = {
                SoloBajoStock: req.query.SoloBajoStock === 'true' || req.query.SoloBajoStock === '1',
            };
            return res.status(200).json(await VerStockEquiposPaginadoService(paginacion, filtros));
        }
        const StockEquipos = await VerStockEquiposService();
        return res.status(200).json(StockEquipos);
    } catch (error) {
        return res.status(500).json({ error: `Error al ver stock de equipos => ${error.message}` });
    }
};
module.exports = {
    VerStockEquiposController
};
