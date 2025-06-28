const { MostrarItemsRemisionQuery } = require('../../../queries/comercial/devoluciones/MostrarItemsRemisionQuery');

const MostrarItemsRemisionService = async (IdRemision) => {
    return await MostrarItemsRemisionQuery(IdRemision);
};
module.exports = {
    MostrarItemsRemisionService
};