const { ListarTiposMovimientoRepuestoService } = require('../../services/generales/TiposMovimientoRepuestoService');

const ListarTiposMovimientoRepuestoController = async (req, res) => {
    try {
        const tipos = await ListarTiposMovimientoRepuestoService();
        return res.status(200).json(tipos);
    } catch (error) {
        return res.status(500).json({ error: `Error al listar tipos de movimiento de repuesto => ${error.message}` });
    }
};
module.exports = {
    ListarTiposMovimientoRepuestoController
};