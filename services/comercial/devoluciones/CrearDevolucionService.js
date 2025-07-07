const { CrearDevolucionQuery } = require('../../../queries/comercial/devoluciones/CrearDevolucionQuery');

const CrearDevolucionService = async (datosDevolucion) => {
    try {
        if (!datosDevolucion || !datosDevolucion.NoDevolucion || !datosDevolucion.Detalles) {
            throw new Error('Datos incompletos para crear la devolución');
        }

        return await CrearDevolucionQuery(datosDevolucion);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    CrearDevolucionService
};