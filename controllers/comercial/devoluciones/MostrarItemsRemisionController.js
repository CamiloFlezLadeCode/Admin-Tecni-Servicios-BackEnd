const { MostrarItemsRemisionService } = require('../../../services/comercial/devoluciones/MostrarItemsRemisionService');

const MostrarItemsRemisionController = async (req, res) => {
    try {
        const { IdRemision } = req.query;
        // const { IdRemision } = req.params;
        const ItemsRemision = await MostrarItemsRemisionService(IdRemision);
        console.log(`Items de remisón obtenidos correctamente: Total: ${ItemsRemision.length}`);
        return res.status(200).json(
            ItemsRemision
        );
    } catch (error) {
        console.error('Error en MostrarItemsRemisionController => ', error);
        res.status(500).json({ error: `Error al consultar los items de la remisión => ${error}` });
    }
};
module.exports = {
    MostrarItemsRemisionController
};