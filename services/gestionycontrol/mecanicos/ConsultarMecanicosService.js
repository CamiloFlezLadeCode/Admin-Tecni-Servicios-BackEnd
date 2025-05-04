const { ConsultarMecanicosQuery } = require('../../../queries/gestionycontrol/mecanicos/ConsultarMecanicosQuery');

const ConsultarMecanicosService = async () => {
    return await ConsultarMecanicosQuery();
};
module.exports = {
    ConsultarMecanicosService
};