const { ConsultarEquiposService } = require('../../../services/gestionycontrol/equipos/ConsultarEquiposService');

const ConsultarEquiposController = async (req, res) => {
    try {
        const Equipos = await ConsultarEquiposService();
        console.log(`Equipos obtenidos correctamente. Total: ${Equipos.length}`);
        return res.status(200).json(Equipos);
    } catch (error) {
        console.error('Error en TraerEquiposController => ', error);
        return res.status(500).json({ error: `Error al crear equipo => ${error}` });
    }
};
module.exports = {
    ConsultarEquiposController
};