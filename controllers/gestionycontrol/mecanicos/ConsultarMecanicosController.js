const { ConsultarMecanicosService } = require('../../../services/gestionycontrol/mecanicos/ConsultarMecanicosService');

const ConsultarMecanicosController = async (req, res) => {
    try {
        const Mecanicos = await ConsultarMecanicosService();
        console.log(Mecanicos);
        res.status(200).json(Mecanicos);
    } catch (error) {
        console.error('Error en ConsultarMecanicosController => ', error);
        res.status(500).json({ error: `Error al crear equipo => ${error}` });
    }
};
module.exports = {
    ConsultarMecanicosController
};