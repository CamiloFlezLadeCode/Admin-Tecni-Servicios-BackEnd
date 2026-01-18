const { ActualizarRemisionService } = require('../../../services/comercial/remisiones/ActualizarRemisionService');

const ActualizarRemisionController = async (req, res) => {
    try {
        const DatosActualizacion = req.body;

        if (!DatosActualizacion.IdRemision) {
            return res.status(400).json({ error: 'El campo IdRemision es requerido' });
        }

        const resultado = await ActualizarRemisionService(DatosActualizacion);

        if (!resultado) {
            return res.status(404).json({ message: 'Remisión no encontrada' });
        }

        if (resultado.huboCambios === false) {
            return res.status(204).json({ message: 'No se realizaron cambios en la remisión' });
        }

        return res.status(200).json({ message: 'Remisión actualizada correctamente' });

    } catch (error) {
        console.error('Error en ActualizarRemisionController => ', error);
        return res.status(500).json({ error: `Error al actualizar la remisión => ${error.message}` });
    }
};

module.exports = {
    ActualizarRemisionController
};
