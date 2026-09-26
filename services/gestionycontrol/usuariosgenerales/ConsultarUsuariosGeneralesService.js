const { ConsultarUsuariosGeneralesQuery, ConsultarUsuariosGeneralesPaginadoQuery } = require('../../../queries/gestionycontrol/usuariosgenerales/ConsultarUsuariosGeneralesQuery');

const ConsultarUsuariosGeneralesService = async () => {
    return await ConsultarUsuariosGeneralesQuery();
};

const ConsultarUsuariosGeneralesPaginadoService = async (paginacion) => {
    return ConsultarUsuariosGeneralesPaginadoQuery(paginacion);
};
module.exports = {
    ConsultarUsuariosGeneralesService,
    ConsultarUsuariosGeneralesPaginadoService
};