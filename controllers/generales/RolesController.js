const { ListarRolesService } = require('../../services/generales/RolesService');

const ListarRolesController = async (req, res) => {
    try {
        const data = await ListarRolesService();
        const Roles = data.map(Rol => ({
            value: Rol.IdRol,
            label: Rol.Rol
        }));
        res.status(200).json(Roles);
    } catch (error) {
        console.error('Error en ListarRolesController => ', error);
        res.status(500).json({ error: `Error al crear equipo => error` });
    }
};
module.exports = {
    ListarRolesController
};