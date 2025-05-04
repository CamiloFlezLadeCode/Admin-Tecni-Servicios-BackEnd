const { ConsultarEquiposQuery } = require('../../../queries/gestionycontrol/equipos/ConsultarEquiposQuery');

const ConsultarEquiposService = async () => {
    return await ConsultarEquiposQuery();
};
module.exports = {
    ConsultarEquiposService
};