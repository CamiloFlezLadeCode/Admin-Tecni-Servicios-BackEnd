const { ConsultarSalidasEquiposService } = require('../../../services/inventario/equipos/ConsultarSalidasEquiposService');

const ConsultarSalidasEquiposController = async (req, res) => {
    try {
        const data = await ConsultarSalidasEquiposService();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: `Error al consultar salidas de equipos => ${error.message}` });
    }
};
module.exports = {
    ConsultarSalidasEquiposController
};
