const { ConsultarVehiculosService } = require('../../../services/gestionycontrol/vehiculos/ConsultarVehiculosService');

const ConsultarVehiculosController = async (req, res) => {
    try {
        const data = await ConsultarVehiculosService();
        console.log(`Vehículos obtenidos correctamente: Total: ${data.length}`);
        return res.status(200).json(data);
    } catch (error) {
        console.error('Error en ConsultarVehiculosController => ', error);
        return res.status(500).json({ error: `Error al crear equipo => error` });
    }
};
module.exports = {
    ConsultarVehiculosController
};