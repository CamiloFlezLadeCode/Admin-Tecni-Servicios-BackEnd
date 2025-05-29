const { ListarBodeguerosService } = require('../../services/generales/BodeguerosService');

const ListarBodeguerosController = async (req, res) => {
    try {
        const Bodegueros = await ListarBodeguerosService();
        console.log(`Bodegueros obtenidos correctamente. Total: ${Bodegueros.length}`);
        const BodeguerosMapeados = Bodegueros.map(bodeguero => ({
            Id: bodeguero.IdBodeguero,
            value: bodeguero.DocumentoBodeguero,
            label: bodeguero.NombreBodeguero
        }));
        res.status(200).json(BodeguerosMapeados);
    } catch (error) {
        console.error('Error en ListarBodeguerosController => ', error);
        res.status(500).json({ error: `Error al crear equipo => error` });
    }
};
module.exports = {
    ListarBodeguerosController
};