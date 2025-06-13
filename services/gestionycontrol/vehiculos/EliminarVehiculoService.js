// const { EliminarVehiculoQuery } = require('../../../queries/gestionycontrol/vehiculos/EliminarVehiculoQuery');

// const EliminarVehiculoService = async (IdVehiculo) => {
//     return await EliminarVehiculoQuery(IdVehiculo);
// };
// module.exports = {
//     EliminarVehiculoService
// };

const { EliminarVehiculoQuery } = require('../../../queries/gestionycontrol/vehiculos/EliminarVehiculoQuery');
const { VerificarVehiculoEnRemisionesQuery } = require('../../../queries/gestionycontrol/vehiculos/VerificarVehiculoEnRemisionesQuery');

const EliminarVehiculoService = async (IdVehiculo) => {
    const tieneRemisiones = await VerificarVehiculoEnRemisionesQuery(IdVehiculo);

    if (tieneRemisiones) {
        throw new Error('No se puede eliminar el vehículo porque tiene remisiones asociadas.');
    }

    return await EliminarVehiculoQuery(IdVehiculo);
};

module.exports = {
    EliminarVehiculoService
};
