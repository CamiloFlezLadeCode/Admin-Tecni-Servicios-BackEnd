const { ConsultarSiguienteNoRemisionQuery } = require('../../../queries/comercial/remisiones/ConsultarSiguienteNoRemisionQuery');

const ConsultarSiguienteNoRemisionService = async () => {
    return await ConsultarSiguienteNoRemisionQuery();
};
module.exports = {
    ConsultarSiguienteNoRemisionService
};