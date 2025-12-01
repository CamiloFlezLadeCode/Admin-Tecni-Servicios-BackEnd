const { SiguienteNumeracion_Para_EntradaRepuestosService, SiguienteNumeracion_Para_SalidaRepuestosService } = require('../../services/generales/SiguienteNumeracionService');

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

const SiguienteNumeracion_Para_SalidaRepuestosController = async (req, res) => {
    try {
        const SiguienteNoSalidaRepuestos = await SiguienteNumeracion_Para_SalidaRepuestosService();
        return res.status(200).json(SiguienteNoSalidaRepuestos);
    } catch (error) {
        console.error('Error en SiguienteNumeracion_Para_SalidaRepuestosController => ', error.message);
        return res.status(500).json({ error: `Error al => ${error.message}` });
    }
};
module.exports.SiguienteNumeracion_Para_SalidaRepuestosController = SiguienteNumeracion_Para_SalidaRepuestosController;