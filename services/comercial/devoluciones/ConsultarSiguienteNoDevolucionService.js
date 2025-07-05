const { ConsultarSiguienteNoDevolucionQuery } = require('../../../queries/comercial/devoluciones/ConsultarSiguienteNoDevolucionQuery');

const ConsultarSiguienteNoDevolucionService = async () => {
    return await ConsultarSiguienteNoDevolucionQuery();
};
module.exports = {
    ConsultarSiguienteNoDevolucionService
};