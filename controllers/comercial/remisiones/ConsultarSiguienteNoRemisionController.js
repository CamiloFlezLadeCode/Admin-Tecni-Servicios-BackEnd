const { ConsultarSiguienteNoRemisionService } = require('../../../services/comercial/remisiones/ConsultarSiguienteNoRemisionService');

const ConsultarSiguienteNoRemisionController = async (req, res) => {
    try {
        const SiguienteNoRemision = await ConsultarSiguienteNoRemisionService();
        res.status(200).json(SiguienteNoRemision);
    } catch (error) {
        console.error('Error en ConsultarSiguienteNoRemisionController => ', error);
        res.status(500).json({ error: `Error al crear equipo => error` });
    }
};
module.exports = {
    ConsultarSiguienteNoRemisionController
};