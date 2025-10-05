const { MostrarEquiposPorDevolverService } = require('../../../services/comercial/devoluciones/MostrarEquiposPorDevolverService');

const MostrarEquiposPorDevolverController = async (req, res) => {
    try {
        const Parametros = req.query;
        const EquiposPorDevolver = await MostrarEquiposPorDevolverService(Parametros);
        console.log(Parametros)
        console.log(`Equipos por devolver obtenidos correctamente. Total: ${EquiposPorDevolver.length}`);
        return res.status(200).json(
            EquiposPorDevolver
        );
    } catch (error) {
        console.error('Error en MostrarEquiposPorDevolverController => ', error.message);
        return res.status(500).json({ error: `Error al => ${error.message}` });
    }
};
module.exports = {
    MostrarEquiposPorDevolverController
};