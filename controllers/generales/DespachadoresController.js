const { ListarDespachadoresService } = require('../../services/generales/DespachadoresService');

const ListarDespachadoresController = async (req, res) => {
    try {
        const Despachadores = await ListarDespachadoresService();
        console.log(`Despachadores obtenidos correctamente. Total: ${Despachadores.length}`);
        const DespachadoresMapeados = Despachadores.map(despachador => ({
            id: despachador.IdDespachador,
            value: despachador.DocumentoDespachador,
            label: despachador.NombreDespachador
        }));
        res.status(200).json(DespachadoresMapeados);
    } catch (error) {
        console.error('Error en ListarDespachadoresController => ', error);
        res.status(500).json({ error: `Error al consultar los despachadores. => ${error}` });
    }
};
module.exports = {
    ListarDespachadoresController
};