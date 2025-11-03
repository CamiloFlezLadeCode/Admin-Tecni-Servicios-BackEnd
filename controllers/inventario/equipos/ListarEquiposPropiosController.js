const { ListarEquiposPropiosService } = require('../../../services/inventario/equipos/ListarEquiposPropiosService');

const ListarEquiposPropiosController = async (req, res) => {
    try {
        const EquiposPropios = await ListarEquiposPropiosService();
        console.log(`Equipos obtenidos correctamente. Total:${EquiposPropios.length}`);
        const EquiposPropiosMapeados = EquiposPropios.map(equipo => ({
            value: equipo.IdEquipo,
            label: equipo.NombreEquipo
        }));
        return res.status(200).json(EquiposPropiosMapeados);
    } catch (error) {
        console.error('Error en ListarEquiposPropiosController => ', error.message);
        return res.status(500).json({ error: `Error al cargar los equipos => ${error.message}` });
    }
};
module.exports = {
    ListarEquiposPropiosController
};