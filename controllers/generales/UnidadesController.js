const { ListarUnidadesService } = require('../../services/generales/UnidadesService');

const ListarUnidadesController = async (req, res) => {
    try {
        const Unidades = await ListarUnidadesService();
        console.log(`UNIDADES OBTENIDAS CORRECTAMENTE. TOTAL:${Unidades.length}`);
        const UnidadesMapeadas = Unidades.map(Unidad => ({
            value: Unidad.IdUnidad,
            label: Unidad.Nombre
        }));
        return res.status(200).json(UnidadesMapeadas);
    } catch (error) {
        console.error('Error en ListarUnidadesController => ', error.message);
        return res.status(500).json({ error: `Error al => ${error.message}` });
    }
};
module.exports = {
    ListarUnidadesController
};