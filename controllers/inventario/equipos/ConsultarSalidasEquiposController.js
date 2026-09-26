const { leerPaginacion } = require('../../../utils/paginacion');
const { ConsultarSalidasEquiposService, ConsultarSalidasEquiposPaginadoService } = require('../../../services/inventario/equipos/ConsultarSalidasEquiposService');

const ConsultarSalidasEquiposController = async (req, res) => {
    try {
        // Con `pagina` responde paginado; sin ella, el listado completo de siempre.
        const paginacion = leerPaginacion(req.query);
        if (paginacion) {
            return res.status(200).json(await ConsultarSalidasEquiposPaginadoService(paginacion));
        }
        const data = await ConsultarSalidasEquiposService();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: `Error al consultar salidas de equipos => ${error.message}` });
    }
};
module.exports = {
    ConsultarSalidasEquiposController
};
