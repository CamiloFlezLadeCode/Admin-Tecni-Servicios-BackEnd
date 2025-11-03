const { ConsultarSiguienteNoEntradaEquipoQuery } = require('../../../queries/inventario/equipos/ConsultarSiguienteNoEntradaEquipoQuery');

const ConsultarSiguienteNoEntradaEquipoService = async () => {
    return await ConsultarSiguienteNoEntradaEquipoQuery();
};
module.exports = {
    ConsultarSiguienteNoEntradaEquipoService
};