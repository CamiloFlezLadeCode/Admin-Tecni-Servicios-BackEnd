const { ListarTipoEquipoService } = require('../../services/generales/TipoEquipoService');

const ListarTipoEquipoController = async (req, res) => {
    try {
        const TiposDeEquipo = await ListarTipoEquipoService();
        console.log(`TIPOS DE EQUIPOS OBTENIDOS CORRECTAMENTE. TOTAL:${TiposDeEquipo.length}`);
        const TiposDeEquipoMapeados = TiposDeEquipo.map(Tipo => ({
            label: Tipo.TipoEquipo,
            value: Tipo.IdTipoEquipo
        }));
        return res.status(200).json(TiposDeEquipoMapeados);
    } catch (error) {
        console.error('Error en ListarTipoEquipoController => ', error.message);
        return res.status(500).json({ error: `Error al => ${error.message}` });
    }
};
module.exports = {
    ListarTipoEquipoController
};