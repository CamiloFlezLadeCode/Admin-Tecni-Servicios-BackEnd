const { ConsultarSubarrendatariosQuery } = require('../../queries/generales/SubarrendatariosQuery');

const ConsultarSubarrendatariosService = async () => {
    return await ConsultarSubarrendatariosQuery();
};
module.exports = {
    ConsultarSubarrendatariosService
};