const { ListarBodegasPorSubarrendatarioService } = require('../../services/generales/BodegasPorSubarrendatarioService');

const ListarBodegasPorSubarrendatarioController = async (req, res) => {
    try {
        const { DocumentoSubarrendatario } = req.query;
        console.log(DocumentoSubarrendatario);
        const Bodegas = await ListarBodegasPorSubarrendatarioService(DocumentoSubarrendatario);
        console.log(`BODEGAS OBTENIDAS CORRECTAMENTE. TOTAL: ${Bodegas.length}`);
        const BodegasMapeadas = Bodegas.map(Bodega => ({
            value: Bodega.IdBodega,
            label: Bodega.NombreBodega
        }));
        return res.status(200).json(BodegasMapeadas);
    } catch (error) {
        console.error('Error en ListarBodegasPorSubarrendatarioController => ', error.message);
        return res.status(500).json({ error: `Error al listar las bodegas del subarrendatario con documento ${DocumentoSubarrendatario} => ${error.message}` });
    }
};
module.exports = {
    ListarBodegasPorSubarrendatarioController
};