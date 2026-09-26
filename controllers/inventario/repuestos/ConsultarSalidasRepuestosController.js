const { leerPaginacion } = require('../../../utils/paginacion');
const { ConsultarSalidasRepuestosService, ConsultarSalidasRepuestosPaginadoService } = require('../../../services/inventario/repuestos/ConsultarSalidasRepuestosService');

const ConsultarSalidasRepuestosController = async (req, res) => {
    try {
        // Con `pagina` responde paginado; sin ella, el listado completo de siempre.
        const paginacion = leerPaginacion(req.query);
        if (paginacion) {
            return res.status(200).json(await ConsultarSalidasRepuestosPaginadoService(paginacion));
        }
        const data = await ConsultarSalidasRepuestosService();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: `Error al consultar salidas de repuestos => ${error.message}` });
    }
};
module.exports = {
    ConsultarSalidasRepuestosController
};