const { ConsultarSiguienteNoDevolucionService } = require('../../../services/comercial/devoluciones/ConsultarSiguienteNoDevolucionService');

const ConsultarSiguienteNoDevolucionController = async (req, res) => {
    try {
        const SiguienteNoDevolucion = await ConsultarSiguienteNoDevolucionService();
        return res.status(200).json(SiguienteNoDevolucion);
    } catch (error) {
        console.error('Error en ConsultarSiguienteNoDevolucionController => ', error);
        return res.status(500).json({ error: `Error al consultar el siguiente número de devolución => error` });
    }
};
module.exports = {
    ConsultarSiguienteNoDevolucionController
};