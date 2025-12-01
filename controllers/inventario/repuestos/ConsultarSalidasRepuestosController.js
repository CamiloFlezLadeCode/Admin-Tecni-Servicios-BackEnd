const { ConsultarSalidasRepuestosService } = require('../../../services/inventario/repuestos/ConsultarSalidasRepuestosService');

const ConsultarSalidasRepuestosController = async (req, res) => {
    try {
        const data = await ConsultarSalidasRepuestosService();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: `Error al consultar salidas de repuestos => ${error.message}` });
    }
};
module.exports = {
    ConsultarSalidasRepuestosController
};