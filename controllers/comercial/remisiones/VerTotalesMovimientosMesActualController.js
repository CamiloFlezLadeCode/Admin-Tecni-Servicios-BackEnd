const { VerTotalesMovimientosMesActualService } = require('../../../services/comercial/remisiones/VerTotalesMovimientosMesActualService');

const VerTotalesMovimientosMesActualController = async (req, res) => {
    try {
        const Respuesta = await VerTotalesMovimientosMesActualService();
        return res.status(200).json(Respuesta);
    } catch (error) {
        console.error('Error en VerTotalesMovimientosMesActualController => ', error?.message || error);
        return res.status(500).json({ error: `Error al consultar totales del mes en curso => ${error?.message || error}` });
    }
};

module.exports = {
    VerTotalesMovimientosMesActualController
};

