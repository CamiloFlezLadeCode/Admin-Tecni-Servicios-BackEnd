const { InfoPDFQuery } = require('../../../queries/comercial/remisiones/InfoPDFQuery');

const InfoPDFService = async (IdRemision) => {
    return await InfoPDFQuery(IdRemision);
};
module.exports = {
    InfoPDFService
};