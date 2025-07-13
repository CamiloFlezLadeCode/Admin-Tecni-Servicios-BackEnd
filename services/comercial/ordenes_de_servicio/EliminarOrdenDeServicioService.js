const { EliminarOrdenDeServicioQuery } = require('../../../queries/comercial/ordenes_de_servicio/EliminarOrdenDeServicioQuery');

const EliminarOrdenDeServicioService = async (IdOrdenDeServicio) => {
    try {
        // Validación básica
        if (!IdOrdenDeServicio || isNaN(IdOrdenDeServicio)) {
            throw new Error('ID de orden de servicio');
        }

        const resultado = await EliminarOrdenDeServicioQuery(Number(IdOrdenDeServicio));

        if (!resultado.success) {
            throw new Error('No se pudo completar la eliminación');
        }

        return resultado;
    } catch (error) {
        console.error('Error en EliminarOrdenDeServicioService: ', error);

        // Manejo de errores específicos
        if (error.message.includes('foreign key constraint')) {
            throw new Error('No se puede eliminar la orden de servicio porque tiene registros relacionados');
        }
        if (error.message.includes('no puede ser negativa')) {
            throw new Error(error.message);
        }

        throw new Error(error.message || 'Error al eliminar la orden de servicio');
    }
};
module.exports = {
    EliminarOrdenDeServicioService
};