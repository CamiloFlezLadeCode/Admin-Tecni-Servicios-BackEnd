const { ListarVehiculosService } = require('../../services/generales/VehiculosService');

const ListarVehiculosController = async (req, res) => {
    try {
        const Vehiculos = await ListarVehiculosService();
        console.log(`Vehículos obtenidos correctamente. Total: ${Vehiculos.length}`);
        const VehiculosMapeados = Vehiculos.map(vehiculo => ({
            value: vehiculo.IdVehiculo,
            label: vehiculo.Placa
        }));
        res.status(200).json(VehiculosMapeados);
    } catch (error) {
        console.error('Error en ListarVehiculosController => ', error);
        res.status(500).json({ error: `Error al consultar los vehículos => ${error}` });
    }
};
module.exports = {
    ListarVehiculosController
};