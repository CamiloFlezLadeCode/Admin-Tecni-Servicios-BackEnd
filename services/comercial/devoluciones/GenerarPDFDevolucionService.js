const { GenerarPDFDevolucionQuery } = require('../../../queries/comercial/devoluciones/GenerarPDFDevolucionQuery');

const GenerarPDFDevolucionService = async (IdDevolucion) => {
    return await GenerarPDFDevolucionQuery(IdDevolucion);
};
module.exports = {
    GenerarPDFDevolucionService
};