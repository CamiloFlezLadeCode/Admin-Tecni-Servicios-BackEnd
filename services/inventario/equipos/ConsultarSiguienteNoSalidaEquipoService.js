const { ConsultarSiguienteNoSalidaEquipoQuery } = require('../../../queries/inventario/equipos/ConsultarSiguienteNoSalidaEquipoQuery');

const ConsultarSiguienteNoSalidaEquipoService = async () => {
    return await ConsultarSiguienteNoSalidaEquipoQuery();
};
module.exports = {
    ConsultarSiguienteNoSalidaEquipoService
};
