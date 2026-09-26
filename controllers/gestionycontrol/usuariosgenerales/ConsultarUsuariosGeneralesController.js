const { leerPaginacion } = require('../../../utils/paginacion');
const { ConsultarUsuariosGeneralesService, ConsultarUsuariosGeneralesPaginadoService } = require('../../../services/gestionycontrol/usuariosgenerales/ConsultarUsuariosGeneralesService');

const ConsultarUsuariosGeneralesController = async (req, res) => {
    try {
        // Con `pagina` responde paginado; sin ella, el listado completo de siempre.
        const paginacion = leerPaginacion(req.query);
        if (paginacion) {
            return res.status(200).json(await ConsultarUsuariosGeneralesPaginadoService(paginacion));
        }
        const UsuariosGenerales = await ConsultarUsuariosGeneralesService();
// console.log(`Usuarios generales obtenidos correctamente. Total: ${UsuariosGenerales.length}`);
        return res.status(200).json(UsuariosGenerales);
    } catch (error) {
        console.error('Error en ConsultarUsuariosGeneralesController => ', error);
        return res.status(500).json({ error: `Error al consultar los usuarios generales => error` });
    }
};
module.exports = {
    ConsultarUsuariosGeneralesController
};