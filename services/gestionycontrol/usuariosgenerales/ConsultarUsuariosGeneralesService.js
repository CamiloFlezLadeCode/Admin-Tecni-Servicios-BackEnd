const { ConsultarUsuariosGeneralesQuery } = require('../../../queries/gestionycontrol/usuariosgenerales/ConsultarUsuariosGeneralesQuery');

const ConsultarUsuariosGeneralesService = async () => {
    return await ConsultarUsuariosGeneralesQuery();
};
module.exports = {
    ConsultarUsuariosGeneralesService
};