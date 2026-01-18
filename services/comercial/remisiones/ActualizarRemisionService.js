const { ActualizarRemisionQuery } = require('../../../queries/comercial/remisiones/ActualizarRemisionQuery');

const ActualizarRemisionService = async (DatosActualizacion) => {
    return await ActualizarRemisionQuery(DatosActualizacion);
};

module.exports = {
    ActualizarRemisionService
};
