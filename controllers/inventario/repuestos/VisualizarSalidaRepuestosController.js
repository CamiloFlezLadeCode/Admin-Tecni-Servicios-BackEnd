const { VisualizarSalidaRepuestosService } = require('../../../services/inventario/repuestos/VisualizarSalidaRepuestosService');

const VisualizarSalidaRepuestosController = async (req, res) => {
    try {
        const { NoSalidaRepuestos } = req.query;
        const SalidaRepuestos = await VisualizarSalidaRepuestosService(NoSalidaRepuestos);
        return res.status(200).json(SalidaRepuestos[0]);
    } catch (error) {
        return res.status(500).json({ error: `Error al visualizar salida de repuestos => ${error.message}` });
    }
};
module.exports = {
    VisualizarSalidaRepuestosController
};