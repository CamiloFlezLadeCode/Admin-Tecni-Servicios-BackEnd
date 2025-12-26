const { VerCantidadRemisionesYDevolucionesUltimos6MesesService } = require('../../../services/comercial/remisiones/VerCantidadRemisionesYDevolucionesUltimos6MesesService');

const VerCantidadRemisionesYDevolucionesUltimos6MesesController = async (req, res) => {
    try {
        const Respuesta = await VerCantidadRemisionesYDevolucionesUltimos6MesesService();
        return res.status(200).json(Respuesta);
    } catch (error) {
        console.error('Error en VerCantidadRemisionesYDevolucionesUltimos6MesesController => ', error?.message || error);
        return res.status(500).json({ error: `Error al consultar cantidad de remisiones y devoluciones => ${error?.message || error}` });
    }
};

module.exports = {
    VerCantidadRemisionesYDevolucionesUltimos6MesesController
};

