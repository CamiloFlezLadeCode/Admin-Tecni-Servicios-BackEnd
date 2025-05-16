const { ListarEquiposService } = require('../../services/generales/EquiposService');

const ListarEquiposController = async (req, res) => {
    try {
        const IdReferencia = req.query;
        const Equipos = await ListarEquiposService(IdReferencia);
        console.log(`Equipos optenidos correctamente. Total: ${Equipos.length}`);
        const EquiposMapeados = Equipos.map(Equipo => ({
            value: Equipo.IdEquipo,
            label: Equipo.Nombre,
            estado: Equipo.Estado
        }));
        res.status(200).json(EquiposMapeados);
    } catch (error) {
        console.error('Error en ListarEquiposController => ', error);
        res.status(500).json({ error: `Error al listar los equipos => ${error}` });
    }
};
module.exports = {
    ListarEquiposController
};