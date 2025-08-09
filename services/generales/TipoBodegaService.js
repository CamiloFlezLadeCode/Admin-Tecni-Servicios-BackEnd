const { TipoBodegaQuery } = require('../../queries/generales/TipoBodegaQuery');

const TipoBodegaService = async () => {
    return await TipoBodegaQuery();
};
module.exports = {
    TipoBodegaService
};