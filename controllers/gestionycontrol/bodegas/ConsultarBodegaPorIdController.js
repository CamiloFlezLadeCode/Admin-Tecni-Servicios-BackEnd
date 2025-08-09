const { ConsultarBodegaPorIdService } = require('../../../services/gestionycontrol/bodegas/ConsultarBodegaPorIdService');

const ConsultarBodegaPorIdController = async (req, res) => {
    try {
        const { IdBodega } = req.query;
        console.log(IdBodega)
        const InfoBodega = await ConsultarBodegaPorIdService(IdBodega);
        if (InfoBodega.length > 0) {
            console.log(`BODEGA CONSULTADA CORRECTAMENTE`);
            return res.status(200).json(InfoBodega);
        } else {
            console.log(`NO SE ENCONTRÓ NINGUNA BODEGA CON ID: ${IdBodega}`);
            return res.status(400).json({ message: `No se encontró ninguna bodega con id: ${IdBodega}` });
        }
    } catch (error) {
        console.error('Error en ConsultarBodegaPorIdController => ', error.message);
        return res.status(500).json({ error: `Error al consultar la información de la bodega => ${error.message}` });
    }
};
module.exports = {
    ConsultarBodegaPorIdController
};