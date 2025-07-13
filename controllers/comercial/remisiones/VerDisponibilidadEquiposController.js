const { VerDisponibilidadEquiposService } = require('../../../services/comercial/remisiones/VerDisponibilidadEquiposService');

const VerDisponibilidadEquiposController = async (req, res) => {
    try {
        const ParametrosConsulta = req.query;
        const DisponibilidadEquipos = await VerDisponibilidadEquiposService(ParametrosConsulta);
        console.log(`Disponibilidad de equipos obtenida correctamente. Total: ${DisponibilidadEquipos.length}`);
        const DisponibilidadEquiposMapeada = DisponibilidadEquipos.map(Equipo => ({
            value: Equipo.IdEquipo,
            label: Equipo.Nombre,
            estado: Equipo.Estado
        }));
        return res.status(200).json(DisponibilidadEquiposMapeada);
    } catch (error) {
        console.error('Error en VerDisponibilidadEquiposController => ', error.message);
        return res.status(500).json({ error: `Error al ver la disponibilidad de los equipos => ${error.message}` });
    }
};
module.exports = {
    VerDisponibilidadEquiposController
};