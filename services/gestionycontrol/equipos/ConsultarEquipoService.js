const { ConsultarEquipoQuery } = require('../../../queries/gestionycontrol/equipos/ConsultarEquipoQuery');

const ConsultarEquipoService = async (IdEquipo) => {
    return await ConsultarEquipoQuery(IdEquipo);
};
module.exports = {
    ConsultarEquipoService
};