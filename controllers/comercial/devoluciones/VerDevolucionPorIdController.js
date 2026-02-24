const { VerDevolucionPorIdService } = require('../../../services/comercial/devoluciones/VerDevolucionPorIdService');

const VerDevolucionPorIdController = async (req, res) => {
    try {
        const { IdDevolucion } = req.query;

        if (!IdDevolucion) {
            return res.status(400).json({ error: 'El parámetro IdDevolucion es requerido' });
        }

        const devolucion = await VerDevolucionPorIdService(IdDevolucion);

        if (!devolucion) {
            return res.status(404).json({ message: 'Devolución no encontrada' });
        }

        return res.status(200).json(devolucion);
    } catch (error) {
        console.error('Error en VerDevolucionPorIdController => ', error);
        return res.status(500).json({ error: `Error al obtener la devolución => ${error}` });
    }
};

module.exports = {
    VerDevolucionPorIdController
};

