const { ConsultarSiguienteNoOrdenDeServicioService } = require('../../../services/comercial/ordenes_de_servicio/ConsultarSiguienteNoOrdenDeServicioService');

const ConsultarSiguienteNoOrdenDeServicioController = async (req, res) => {
    try {
        const SiguienteNumeroOrdenDeServicio = await ConsultarSiguienteNoOrdenDeServicioService();
        return res.status(200).json(SiguienteNumeroOrdenDeServicio);
    } catch (error) {
        console.error('Error en ConsultarSiguienteNoOrdenDeServicioController => ', error.message);
        return res.status(500).json({ error: `Error al consultar el siguiente número de orden de servicio => ${error.message}` });
    }
};
module.exports = {
    ConsultarSiguienteNoOrdenDeServicioController
};