const { ListarNivelesService } = require('../../services/generales/NivelesService');

const ListarNivelesController = async (req, res) => {
    try {
        const data = await ListarNivelesService();
        console.log(`Niveles obtenidos correctamente. Total: ${data.length}`);
        const Niveles = data.map(nivel => ({
            value: nivel.IdNivel,
            label: nivel.Nivel
        }));
        res.status(200).json(Niveles);
    } catch (error) {
        console.error('Error en ListarNivelesController => ', error);
        res.status(500).json({ error: `Error al crear equipo => error` });
    }
};
module.exports = {
    ListarNivelesController
};