const { VerDisponibilidadRepuestoService } = require('../../../services/comercial/ordenes_de_servicio/VerDisponibilidadRepuestoService');

const VerDisponibilidadRepuestoController = async (req, res) => {
    try {
        const ParametrosBusquedaCantidadRepuestoDisponible = req.query;
        const CantidadDisponibleRepuesto = await VerDisponibilidadRepuestoService(ParametrosBusquedaCantidadRepuestoDisponible);
        console.log(`CANTIDAD DISPONIBLE DEL REPUESTO OBTENIDA CORRECTAMENTE. ${CantidadDisponibleRepuesto[0].CantidadDisponibleRepuesto}`);
        return res.status(200).json(CantidadDisponibleRepuesto);
    } catch (error) {
        console.error('Error en VerDisponibilidadRepuestoController => ', error.message);
        return res.status(500).json({ error: `Error al => ${error.message}` });
    }
};
module.exports = {
    VerDisponibilidadRepuestoController
};