const { ActualizarEquipoQuery } = require('../../../queries/gestionycontrol/equipos/ActualizarEquipoQuery');

const ActualizarEquipoService = async (DatosEquipoAActualizar) => {
    return await ActualizarEquipoQuery(DatosEquipoAActualizar);
};
module.exports = {
    ActualizarEquipoService
};