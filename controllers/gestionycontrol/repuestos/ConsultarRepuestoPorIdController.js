const { ConsultarRepuestoPorIdService } = require('../../../services/gestionycontrol/repuestos/ConsultarRepuestoPorIdService');

const ConsultarRepuestoPorIdController = async (req, res) => {
    try {
        const { IdRepuesto } = req.params;
        const Repuesto = await ConsultarRepuestoPorIdService(IdRepuesto);
        console.log(Repuesto);
        return res.status(200).json(Repuesto);
    } catch (error) {
        console.error('Error en ConsultarRepuestoPorIdController => ', error);
        return res.status(500).json({ error: `Error al crear equipo => error` });
    }
};
module.exports = {
    ConsultarRepuestoPorIdController
};