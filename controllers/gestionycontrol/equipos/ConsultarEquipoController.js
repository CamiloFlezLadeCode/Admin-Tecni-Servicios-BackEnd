const { ConsultarEquipoService } = require('../../../services/gestionycontrol/equipos/ConsultarEquipoService');

const ConsultarEquipoController = async (req, res) => {
    try {
        const IdEquipo = req.params.IdEquipo;
        const InfoEquipo = await ConsultarEquipoService(IdEquipo);
        console.log(`Información del equipo obtenida correctamente.`);
        res.status(200).json(InfoEquipo);
    } catch (error) {
        console.error('Error en ConsultarEquipoController => ', error);
        res.status(500).json({ error: `Error al crear equipo => error` });
    }
};
module.exports = {
    ConsultarEquipoController
};