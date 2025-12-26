const { VerActividadRecienteMovimientosService } = require('../../../services/comercial/remisiones/VerActividadRecienteMovimientosService');

const VerActividadRecienteMovimientosController = async (req, res) => {
    try {
        const Respuesta = await VerActividadRecienteMovimientosService({ Limite: req.query?.Limite });
        return res.status(200).json(Respuesta);
    } catch (error) {
        console.error('Error en VerActividadRecienteMovimientosController => ', error?.message || error);
        return res.status(500).json({ error: `Error al consultar actividad reciente => ${error?.message || error}` });
    }
};

module.exports = {
    VerActividadRecienteMovimientosController
};

