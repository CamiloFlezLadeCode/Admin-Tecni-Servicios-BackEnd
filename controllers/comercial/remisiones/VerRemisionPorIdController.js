const { VerRemisionPorIdService } = require('../../../services/comercial/remisiones/VerRemisionPorIdService');

const VerRemisionPorIdController = async (req, res) => {
    try {
        const { IdRemision } = req.query;

        if (!IdRemision) {
            return res.status(400).json({ error: 'El parámetro IdRemision es requerido' });
        }

        const remision = await VerRemisionPorIdService(IdRemision);

        if (!remision) {
            return res.status(404).json({ message: 'Remisión no encontrada' });
        }

        return res.status(200).json([remision]);
    } catch (error) {
        console.error('Error en VerRemisionPorIdController => ', error);
        return res.status(500).json({ error: `Error al obtener la remisión => ${error}` });
    }
};

module.exports = {
    VerRemisionPorIdController
};
