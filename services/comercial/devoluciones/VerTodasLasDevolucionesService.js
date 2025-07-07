const { VerTodasLasDevolucionesQuery } = require('../../../queries/comercial/devoluciones/VerTodasLasDevolucionesQuery');

const VerTodasLasDevolucionesService = async () => {
    return await VerTodasLasDevolucionesQuery();
};
module.exports = {
    VerTodasLasDevolucionesService
};