const { VerStockRepuestosService } = require('../../../services/inventario/repuestos/VerStockRepuestosService');

const VerStockRepuestosController = async (req, res) => {
    try {
        const RepuestosStock = await VerStockRepuestosService();
        console.log(`Stock de repuestos obtenido correctamente. Total: ${RepuestosStock.length}`);
        return res.status(200).json(RepuestosStock);
    } catch (error) {
        console.error('Error en VerStockRepuestosController => ', error.message);
        return res.status(500).json({ error: `Error al consultar el stock de repuestos => ${error.message}` });
    }
};
module.exports = {
    VerStockRepuestosController
};