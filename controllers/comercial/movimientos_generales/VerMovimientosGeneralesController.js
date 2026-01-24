const { VerMovimientosGeneralesService } = require('../../../services/comercial/movimientos_generales/VerMovimientosGeneralesService');

const VerMovimientosGeneralesController = async (req, res) => {
    try {
        const movimientos = await VerMovimientosGeneralesService();
        console.log(`Movimientos generales consultados correctamente. Total: ${movimientos.length}`);
        return res.status(200).json(movimientos);
    } catch (error) {
        console.error('Error en VerMovimientosGeneralesController => ', error);
        return res.status(500).json({ 
            success: false,
            error: `Error al consultar los movimientos generales => ${error.message}` 
        });
    }
};

module.exports = {
    VerMovimientosGeneralesController
};
