const { ConsultarVehiculoService } = require('../../../services/gestionycontrol/vehiculos/ConsultarVehiculoService');

const ConsultarVehiculoController = async (req, res) => {
    try {
        const IdVehiculo = req.params.IdVehiculo;
        const Vehiculo = await ConsultarVehiculoService(IdVehiculo);
        console.log(`Vehículo con id: ${IdVehiculo}, obtenido correctamente.`);
        return res.status(200).json(Vehiculo);
    } catch (error) {
        console.error('Error en ConsultarVehiculoController => ', error);
        return res.status(500).json({ error: `Error al consultar el vehículo => error` });
    }
};
module.exports = {
    ConsultarVehiculoController
};