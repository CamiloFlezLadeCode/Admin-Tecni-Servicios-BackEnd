const { ConsultarRemisionesQuery } = require('../../../queries/comercial/remisiones/ConsultarRemisionesQuery');

const ConsultarRemisionesService = async () => {
    return await ConsultarRemisionesQuery();
};
module.exports = {
    ConsultarRemisionesService
};