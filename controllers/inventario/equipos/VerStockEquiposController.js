const { VerStockEquiposService } = require('../../../services/inventario/equipos/VerStockEquiposService');

const VerStockEquiposController = async (req, res) => {
    try {
        const StockEquipos = await VerStockEquiposService();
        return res.status(200).json(StockEquipos);
    } catch (error) {
        return res.status(500).json({ error: `Error al ver stock de equipos => ${error.message}` });
    }
};
module.exports = {
    VerStockEquiposController
};
