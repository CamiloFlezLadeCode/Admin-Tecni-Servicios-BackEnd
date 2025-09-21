const { VerDisponibilidadEquiposGeneralesQuery } = require('../../../queries/comercial/remisiones/VerDisponibilidadEquiposGeneralesQuery');

const VerDisponibilidadEquiposGeneralesService = async (ParametrosConsulta) => {
    return await VerDisponibilidadEquiposGeneralesQuery(ParametrosConsulta);
};
module.exports = {
    VerDisponibilidadEquiposGeneralesService
};