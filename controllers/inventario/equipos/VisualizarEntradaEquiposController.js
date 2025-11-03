const { VisualizarEntradaEquiposService } = require('../../../services/inventario/equipos/VisualizarEntradaEquiposService');

const VisualizarEntradaEquiposController = async (req, res) => {
    try {
        const { NoEntradaEquipos } = req.query;
        const EntradaEquipos = await VisualizarEntradaEquiposService(NoEntradaEquipos);
        if (EntradaEquipos.length >= 1) console.log(`Entrada de equipos obtenida correctamente.`);
        return res.status(200).json(EntradaEquipos);
    } catch (error) {
        console.error('Error en VisualizarEntradaEquiposController => ', error.message);
        return res.status(500).json({ error: `Error al => ${error.message}` });
    }
};
module.exports = {
    VisualizarEntradaEquiposController
};