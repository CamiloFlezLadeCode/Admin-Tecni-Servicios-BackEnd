const { VerDisponibilidadEquiposGeneralesService } = require('../../../services/comercial/remisiones/VerDisponibilidadEquiposGeneralesService');

const VerDisponibilidadEquiposGeneralesController = async (req, res) => {
    try {
        const ParametrosConsulta = req.query;
        const DisponibilidadEquipos = await VerDisponibilidadEquiposGeneralesService(ParametrosConsulta);
        console.log(`Disponibilidad de equipos obtenida correctamente. Total: ${DisponibilidadEquipos.length}`);
        const DisponibilidadEquiposMapeada = DisponibilidadEquipos.map(Equipo => ({
            value: Equipo.IdEquipo,
            label: Equipo.Nombre,
            estado: 'Disponible'
        }))
        return res.status(200).json(DisponibilidadEquiposMapeada);
    } catch (error) {
        console.error('Error en VerDisponibilidadEquiposGeneralesController => ', error.message);
        return res.status(500).json({ error: `Error al => ${error.message}` });
    }
};
module.exports = {
    VerDisponibilidadEquiposGeneralesController
};