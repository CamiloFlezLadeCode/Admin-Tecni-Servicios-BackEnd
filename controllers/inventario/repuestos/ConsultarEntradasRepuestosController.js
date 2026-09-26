const { leerPaginacion } = require('../../../utils/paginacion');
const { ConsultarEntradasRepuestosService, ConsultarEntradasRepuestosPaginadoService } = require('../../../services/inventario/repuestos/ConsultarEntradasRepuestosService');

const ConsultarEntradasRepuestosController = async (req, res) => {
    try {
        // Con `pagina` responde paginado; sin ella, el listado completo de siempre.
        const paginacion = leerPaginacion(req.query);
        if (paginacion) {
            return res.status(200).json(await ConsultarEntradasRepuestosPaginadoService(paginacion));
        }
        const EntradasRepuestos = await ConsultarEntradasRepuestosService();
// console.log(`Entradas de repuestos obtenidas correctamente. Total: ${EntradasRepuestos.length}`);
        return res.status(200).json(EntradasRepuestos);
    } catch (error) {
        console.error('Error en ConsultarEntradasRepuestosController => ', error.message);
        return res.status(500).json({ error: `Error al => ${error.message}` });
    }
};
module.exports = {
    ConsultarEntradasRepuestosController
};