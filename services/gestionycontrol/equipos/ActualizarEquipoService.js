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
        await ActualizarEquipoQuery(DatosEquipoAActualizar);
        
        // Retornamos los datos actualizados para el socket
        // Nota: Cantidad y CantidadDisponible no se actualizan en este endpoint
        return {
            ...DatosEquipoAActualizar
        };
    } catch (error) {
        console.error('Error en ActualizarEquipoService:', error);
        throw error;
    }
};

module.exports = {
    ActualizarEquipoService
};