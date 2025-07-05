const { VerCantidadDisponibleService } = require('../../../services/comercial/remisiones/VerCantidadDisponibleService');

const VerCantidadDisponibleController = async (req, res) => {
    try {
        const IdEquipo = req.params.IdEquipo;
        if(!IdEquipo) {
            res.status(400).json('El id del equipo es requerido');
        }
        const Cantidad = await VerCantidadDisponibleService(IdEquipo);
        const CantidadMapeada = Cantidad.map(cantidad => ({
            CantidadDisponible: cantidad.Cantidad,
            PrecioAlquiler: cantidad.PrecioAlquiler,
            PrecioVenta: cantidad.PrecioVenta,
            PrecioReparacion: cantidad.PrecioReparacion
        }));
        console.log(`Cantidad del equipo con Id ${IdEquipo}, obtenida correctamente ${CantidadMapeada[0].CantidadDisponible}`);
        return res.status(200).json(CantidadMapeada);
    } catch (error) {
        console.error('Error en VerCantidadDisponibleController => ', error);
        return res.status(500).json({ error: `Error al obtener la cantidad disponible: ${error.message}` }); 
    }
};
module.exports = {
    VerCantidadDisponibleController
};