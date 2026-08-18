const { ConsultarUbicacionEquipoQuery } = require('../../../queries/gestionycontrol/equipos/ConsultarUbicacionEquipoQuery');

const ConsultarUbicacionEquipoService = async (IdEquipo) => {
    return await ConsultarUbicacionEquipoQuery(IdEquipo);
};
module.exports = {
    ConsultarUbicacionEquipoService
};
