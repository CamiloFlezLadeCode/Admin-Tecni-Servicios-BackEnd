const { CrearEquipoQuery } = require('../../../queries/gestionycontrol/equipos/CrearEquipoQuery');

const CrearEquipoService = async (equipoData) => {
    return await CrearEquipoQuery(equipoData);
};
module.exports = {
    CrearEquipoService
};