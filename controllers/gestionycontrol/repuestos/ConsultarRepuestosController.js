const { ConsultarRepuestosService } = require('../../../services/gestionycontrol/repuestos/ConsultarRepuestosService');

const ConsultarRepuestosController = async (req, res) => {
    try {
        const Repuestos = await ConsultarRepuestosService();
        console.log(`Repuestos obtenidos correctamente. Total: ${Repuestos.length}`);
        return res.status(200).json(Repuestos);
    } catch (error) {
        console.error('Error en ConsultarRepuestosController => ', error);
        return res.status(500).json({ error: `Error al consultar los repuestos => ${error}` });
    }
};
module.exports = {
    ConsultarRepuestosController
};