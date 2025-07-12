const { EliminarRemisionQuery } = require('../../../queries/comercial/remisiones/EliminarRemisionQuery');

const EliminarRemisionService = async (IdRemision) => {
    // return await EliminarRemisionQuery();
    try {
        if (!IdRemision || isNaN(IdRemision)) {
            throw new Error('ID de remisión inválido');
        }

        const resultado = await EliminarRemisionQuery(Number(IdRemision));

        if (!resultado.success) {
            throw new Error('No se pudo eliminar la remisión');
        }

        return resultado;
    } catch (error) {
        console.error('Error en EliminarRemisionService:', error);

        // Manejo específico de errores
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            throw new Error('No se puede eliminar la remisión porque tiene registros relacionados');
        }

        throw new Error(error.message || 'Error al eliminar la remisión');
    }
};
module.exports = {
    EliminarRemisionService
};