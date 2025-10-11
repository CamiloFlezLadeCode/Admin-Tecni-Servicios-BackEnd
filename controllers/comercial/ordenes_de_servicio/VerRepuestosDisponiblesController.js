const { VerRepuestosDisponiblesService } = require('../../../services/comercial/ordenes_de_servicio/VerRepuestosDisponiblesService');

const VerRepuestosDisponiblesController = async (req, res) => {
    try {
        const ParametrosDeBusqueda = req.query;
        const Repuestos = await VerRepuestosDisponiblesService(ParametrosDeBusqueda);
        console.log(`REPUESTOS OBTENIDOS CORRECTAMENTE. TOTTAL${Repuestos.length}`);
        const RepuestosMapeados = Repuestos.map(repuesto => ({
            value: repuesto.IdRepuesto,
            label: repuesto.NombreRepuesto
        }));
        return res.status(200).json(RepuestosMapeados);
    } catch (error) {
        console.error('Error en VerRepuestosDisponiblesController => ', error.message);
        return res.status(500).json({ error: `Error al => ${error.message}` });
    }
};
module.exports = {
    VerRepuestosDisponiblesController
};