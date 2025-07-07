const { VerTodasLasDevolucionesService } = require('../../../services/comercial/devoluciones/VerTodasLasDevolucionesService');

const VerTodasLasDevolucionesController = async (req, res) => {
    try {
        const Devoluciones = await VerTodasLasDevolucionesService();
        console.log(`Todas las devoluciones se obtuvieron correctemante. Total: ${Devoluciones.length}`);
        return res.status(200).json(Devoluciones);
    } catch (error) {
        console.error('Error en VerTodasLasDevolucionesController => ', error.message);
        return res.status(500).json({ error: `Error al cargar todas las devoluciones => ${error.message}` });
    }
};
module.exports = {
    VerTodasLasDevolucionesController
};