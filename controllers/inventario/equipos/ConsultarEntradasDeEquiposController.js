const { ConsultarEntradasDeEquiposService } = require('../../../services/inventario/equipos/ConsultarEntradasDeEquiposService');

const ConsultarEntradasDeEquiposController = async (req, res) => {
    try {
        const EntradasDeEquipos = await ConsultarEntradasDeEquiposService();
        console.log(`Entradas de equipos obtenidas correctamente. Total:${EntradasDeEquipos.length}`);
        return res.status(200).json(EntradasDeEquipos);
    } catch (error) {
        console.error('Error en ConsultarEntradasDeEquiposController => ', error.message);
        return res.status(500).json({ error: `Error al consultar las entradas de los equipos => ${error.message}` });
    }
};
module.exports = {
    ConsultarEntradasDeEquiposController
};