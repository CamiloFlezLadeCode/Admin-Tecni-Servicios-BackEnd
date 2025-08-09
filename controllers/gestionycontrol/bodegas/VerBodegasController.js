const { VerBodegasService } = require('../../../services/gestionycontrol/bodegas/VerBodegasService');

const VerBodegasController = async (req, res) => {
    try {
        const Bodegas = await VerBodegasService();
        console.log(`BODEGAS OBTENIDAS CORRECTAMENTE. TOTAL: ${Bodegas.length}`);
        return res.status(200).json(Bodegas);
    } catch (error) {
        console.error('Error en VerBodegasController => ', error.message);
        return res.status(500).json({ error: `Error al consultar las bodegas => ${error.message}` });
    }
};
module.exports = {
    VerBodegasController
};