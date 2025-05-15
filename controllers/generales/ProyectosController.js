const { ListarProyectosService } = require('../../services/generales/ProyectosService');

const ListarProyectosController = async (req, res) => {
    try {
        const info = await ListarProyectosService();
        const Proyectos = info.map(proyecto => ({
            value: proyecto.IdProyecto,
            label: proyecto.Nombre
        }));
        res.status(200).json(Proyectos);
    } catch (error) {
        console.error('Error en ListarProyectosController => ', error);
        res.status(500).json({ error: `Error al listar los proyectos => error` });
    }
};
module.exports = {
    ListarProyectosController
};