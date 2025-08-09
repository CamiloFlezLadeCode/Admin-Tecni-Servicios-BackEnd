const { VerBodegasQuery } = require('../../../queries/gestionycontrol/bodegas/VerBodegasQuery');

const VerBodegasService = async () => {
    return await VerBodegasQuery();
};
module.exports = {
    VerBodegasService
};