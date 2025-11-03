const { VisualizarEntradaRepuestosService } = require('../../../services/inventario/repuestos/VisualizarEntradaRepuestosService');

const VisualizarEntradaRepuestosController = async (req, res) => {
    try {
        const { NoEntradaRepuestos } = req.query;
        const EntradaRepuestos = await VisualizarEntradaRepuestosService(NoEntradaRepuestos);
        console.log(`Entrada de repuestos obtenida correctamente`);
        return res.status(200).json(EntradaRepuestos[0]);
    } catch (error) {
        console.error('Error en VisualizarEntradaRepuestosController => ', error.message);
        return res.status(500).json({ error: `Error al => ${error.message}` });
    }
};
module.exports = {
    VisualizarEntradaRepuestosController
};