const { ListarTiposMovimientoEquipoService } = require('../../services/generales/TiposMovimientoEquipoService');

const ListarTiposMovimientoEquipoController = async (req, res) => {
    try {
        const tipos = await ListarTiposMovimientoEquipoService();
        console.log(`Tipos de movimiento de equipo obtenidos. Total: ${tipos.length}`);
        return res.status(200).json(tipos);
    } catch (error) {
        console.error('Error en ListarTiposMovimientoEquipoController => ', error.message);
        return res.status(500).json({ error: `Error al listar tipos de movimiento de equipo => ${error.message}` });
    }
};
module.exports = {
    ListarTiposMovimientoEquipoController
};