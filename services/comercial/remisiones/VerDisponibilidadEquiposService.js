const { VerDisponibilidadEquiposQuery } = require('../../../queries/comercial/remisiones/VerDisponibilidadEquiposQuery');

const VerDisponibilidadEquiposService = async (ParametrosConsulta) => {
    return await VerDisponibilidadEquiposQuery(ParametrosConsulta);
};
module.exports = {
    VerDisponibilidadEquiposService
};