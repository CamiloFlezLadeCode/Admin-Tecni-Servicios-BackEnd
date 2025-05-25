const { CrearVehiculoService } = require('../../../services/gestionycontrol/vehiculos/CrearVehiculoService');

const CrearVehiculoController = async (req, res) => {
    try {
        const DatosVehiculo = req.body;
        await CrearVehiculoService(DatosVehiculo);
        console.log("Vehículo creado correctamente.");
        res.status(200).json('Vehículo creado correctamente.');
    } catch (error) {
        console.error('Error en CrearVehiculoController => ', error);
        res.status(500).json({ error: `Error al crear el vehiculo => ${error}` });
    }
};
module.exports = {
    CrearVehiculoController
};