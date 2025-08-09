const { TipoBodegaService } = require('../../services/generales/TipoBodegaService');

const ListarTipoBodegaController = async (req, res) => {
    try {
        const Bodegas = await TipoBodegaService();
        console.log(`TIPOS DE BODEGAS CONSULTADOS CORRECTAMENTE. TOTAL: ${Bodegas.length}`);
        const BodegasMapeadas = Bodegas.map(bodega => ({
            value: bodega.IdTipoBodega,
            label: bodega.TipoBodega
        }));
        return res.status(200).json(BodegasMapeadas);
    } catch (error) {
        console.error('Error en TipoBodegaController => ', error.message);
        return res.status(500).json({ error: `Error al consultar los tipos de bodegas => ${error.message}` });
    }
};
module.exports = {
    ListarTipoBodegaController
};