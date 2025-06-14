const { ConsultarRepuestoPorIdService } = require('../../../services/gestionycontrol/repuestos/ConsultarRepuestoPorIdService');

const ConsultarRepuestoPorIdController = async (req, res) => {
    try {
        const { IdRepuesto } = req.params;
        const Repuesto = await ConsultarRepuestoPorIdService(IdRepuesto);
        console.log(Repuesto);
        res.status(200).json(Repuesto);
    } catch (error) {
        console.error('Error en ConsultarRepuestoPorIdController => ', error);
        res.status(500).json({ error: `Error al crear equipo => error` });
    }
};
module.exports = {
    ConsultarRepuestoPorIdController
};