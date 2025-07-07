// const { ActualizarEquipoQuery } = require('../../../queries/gestionycontrol/equipos/ActualizarEquipoQuery');

// const ActualizarEquipoService = async (DatosEquipoAActualizar) => {
//     return await ActualizarEquipoQuery(DatosEquipoAActualizar);
// };
// module.exports = {
//     ActualizarEquipoService
// };


const { ActualizarEquipoQuery } = require('../../../queries/gestionycontrol/equipos/ActualizarEquipoQuery');

const ActualizarEquipoService = async (DatosEquipoAActualizar) => {
    try {
        const resultado = await ActualizarEquipoQuery(DatosEquipoAActualizar);
        
        // Retornamos los datos actualizados para el socket
        return {
            ...DatosEquipoAActualizar,
            CantidadDisponible: resultado.affectedRows > 0 ? 
                (DatosEquipoAActualizar.CantidadDisponible || 0) + 
                (DatosEquipoAActualizar.Cantidad - (DatosEquipoAActualizar.CantidadAnterior || 0)) : 
                null
        };
    } catch (error) {
        console.error('Error en ActualizarEquipoService:', error);
        throw error;
    }
};

module.exports = {
    ActualizarEquipoService
};