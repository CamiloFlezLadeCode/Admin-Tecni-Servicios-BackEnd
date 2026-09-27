const { VerResumenDashboardService } = require('../../services/dashboard/VerResumenDashboardService');

const VerResumenDashboardController = async (req, res) => {
    try {
        const Respuesta = await VerResumenDashboardService();
        return res.status(200).json(Respuesta);
    } catch (error) {
        console.error('Error en VerResumenDashboardController => ', error?.message || error);
        return res.status(500).json({ error: `Error al consultar el resumen del panel => ${error?.message || error}` });
    }
};

module.exports = {
    VerResumenDashboardController
};
