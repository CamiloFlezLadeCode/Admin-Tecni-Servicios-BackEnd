const { ConsultarSiguienteNoRemisionService } = require('../../../services/comercial/remisiones/ConsultarSiguienteNoRemisionService');

const ConsultarSiguienteNoRemisionController = async (req, res) => {
    try {
        const SiguienteNoRemision = await ConsultarSiguienteNoRemisionService();
        return res.status(200).json(SiguienteNoRemision);
    } catch (error) {
        console.error('Error en ConsultarSiguienteNoRemisionController => ', error);
        return res.status(500).json({ error: `Error al consultar el siguiente número de remisión => ${error}` });
    }
};
module.exports = {
    ConsultarSiguienteNoRemisionController
};