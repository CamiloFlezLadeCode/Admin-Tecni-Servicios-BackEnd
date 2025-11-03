const { ListarRepuestosService } = require('../../../services/inventario/repuestos/ListarRepuestosService');

const ListarRepuestosController = async (req, res) => {
    try {
        const Repuestos = await ListarRepuestosService();
        console.log(`Repuestos obtenidos correctamente. Total:${Repuestos.length}`);
        return res.status(200).json(Repuestos);
    } catch (error) {
        console.error('Error en ListarRepuestosController => ', error.message);
        return res.status(500).json({ error: `Error al => ${error.message}` });
    }
};
module.exports = {
    ListarRepuestosController
};