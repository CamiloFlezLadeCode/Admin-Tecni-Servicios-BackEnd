const { EliminarDevolucionQuery } = require('../../../queries/comercial/devoluciones/EliminarDevolucionQuery');

const EliminarDevolucionService = async (IdDevolucion) => {
    try {
        // Validaciones básicas
        if (!IdDevolucion || isNaN(IdDevolucion)) {
            throw new Error('ID de devolución inválido');
        }

        const resultado = await EliminarDevolucionQuery(Number(IdDevolucion));

        if (!resultado.success) {
            throw new Error('No se pudo completar la eliminación');
        }

        return resultado;
    } catch (error) {
        console.error('Error en EliminarDevolucionService:', error);

        // Manejo de errores específicos
        if (error.message.includes('foreign key constraint')) {
            throw new Error('No se puede eliminar la devolución porque tiene registros relacionados');
        }
        if (error.message.includes('no puede ser negativa')) {
            throw new Error(error.message);
        }

        throw new Error(error.message || 'Error al eliminar la devolución');
    }
};
module.exports = {
    EliminarDevolucionService
};