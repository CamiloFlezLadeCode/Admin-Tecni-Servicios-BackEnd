const { ActualizarDevolucionService } = require('../../../services/comercial/devoluciones/ActualizarDevolucionService');
const ActualizarDevolucionController = async (req, res) => {
    try {
        const Data = req.body;
        const resultado = await ActualizarDevolucionService(Data);
        return res.status(resultado.code).json({
            code: resultado.code,
            success: resultado.success,
            huboCambios: resultado.huboCambios,
            message: resultado.message,
            detallesActualizados: resultado.detallesActualizados
        });
    } catch (error) {
        console.error('Error al actualizar la devolución: ', error);
        return res.status(500).json({ error: 'Error al actualizar la devolución' });
    }
};
module.exports = {
    ActualizarDevolucionController
}
