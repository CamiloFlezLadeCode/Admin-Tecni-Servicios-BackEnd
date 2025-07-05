const { ConsultarRemisionesService } = require('../../../services/comercial/remisiones/ConsultarRemisionesService');

const ConsultarRemisionesController = async (req, res) => {
    try {
        const Remisiones = await ConsultarRemisionesService();
        console.log(`Remisiones consultadas correctamente. Total: ${Remisiones.length}`);
        return res.status(200).json(
            Remisiones
        );
    } catch (error) {
        console.error('Error en ConsultarRemisionesController => ', error);
        return res.status(500).json({ error: `Error al consultar las remisiones => ${error}` });
    }
};
module.exports = {
    ConsultarRemisionesController
};