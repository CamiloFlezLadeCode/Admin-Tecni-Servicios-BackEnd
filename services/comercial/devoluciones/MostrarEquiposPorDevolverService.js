const { MostrarEquiposPorDevolverQuery } = require('../../../queries/comercial/devoluciones/MostrarEquiposPorDevolverQuery');

const MostrarEquiposPorDevolverService = async (Parametros) => {
    return await MostrarEquiposPorDevolverQuery(Parametros);
};
module.exports = {
    MostrarEquiposPorDevolverService
};