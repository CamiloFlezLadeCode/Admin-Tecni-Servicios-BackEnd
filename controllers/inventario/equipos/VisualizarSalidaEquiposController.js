const { VisualizarSalidaEquiposService } = require('../../../services/inventario/equipos/VisualizarSalidaEquiposService');

const VisualizarSalidaEquiposController = async (req, res) => {
    try {
        const { NoSalidaEquipos } = req.query;
        if (!NoSalidaEquipos) {
            return res.status(400).json({ error: 'Falta el parámetro NoSalidaEquipos' });
        }
        const SalidaEquipos = await VisualizarSalidaEquiposService(NoSalidaEquipos);
        if (SalidaEquipos.length === 0) {
            return res.status(404).json({ error: 'No se encontró la salida de equipos' });
        }
        return res.status(200).json(SalidaEquipos[0]);
    } catch (error) {
        return res.status(500).json({ error: `Error al visualizar salida de equipos => ${error.message}` });
    }
};
module.exports = {
    VisualizarSalidaEquiposController
};
