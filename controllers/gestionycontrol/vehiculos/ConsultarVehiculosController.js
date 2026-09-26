const { leerPaginacion } = require('../../../utils/paginacion');
const { ConsultarVehiculosService, ConsultarVehiculosPaginadoService } = require('../../../services/gestionycontrol/vehiculos/ConsultarVehiculosService');

const ConsultarVehiculosController = async (req, res) => {
    try {
        // Con `pagina` responde paginado; sin ella, el listado completo de siempre.
        const paginacion = leerPaginacion(req.query);
        if (paginacion) {
            return res.status(200).json(await ConsultarVehiculosPaginadoService(paginacion));
        }
        const data = await ConsultarVehiculosService();
// console.log(`Vehículos obtenidos correctamente: Total: ${data.length}`);
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error en ConsultarVehiculosController => ', error);
        return res.status(500).json({ error: `Error al crear equipo => error` });
    }
};
module.exports = {
    ConsultarVehiculosController
};