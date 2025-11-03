const { SiguienteNumeracion_Para_EntradaRepuestosService } = require('../../services/generales/SiguienteNumeracionService');

const SiguienteNumeracion_Para_EntradaRepuestosController = async (req, res) => {
    try {
        const SiguienteNoEntradaRepuestos = await SiguienteNumeracion_Para_EntradaRepuestosService();
        return res.status(200).json(SiguienteNoEntradaRepuestos);
    } catch (error) {
        console.error('Error en SiguienteNumeracion_Para_EntradaRepuestosController => ', error.message);
        return res.status(500).json({ error: `Error al => ${error.message}` });
    }
};
module.exports = {
    SiguienteNumeracion_Para_EntradaRepuestosController
};