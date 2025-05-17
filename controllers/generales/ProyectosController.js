const { ListarProyectosService } = require('../../services/generales/ProyectosService');

const ListarProyectosController = async (req, res) => {
    try {
        const Cliente = req.query;
        const info = await ListarProyectosService(Cliente);
        const Proyectos = info.map(proyecto => ({
            value: proyecto.IdProyecto,
            label: proyecto.Nombre
        }));
        console.log(`Proyectos del cliente ${Cliente.Cliente}, obtenidos correctamente. Total: ${info.length}`);
        res.status(200).json(Proyectos);
    } catch (error) {
        console.error('Error en ListarProyectosController => ', error);
        res.status(500).json({ error: `Error al listar los proyectos => error` });
    }
};
module.exports = {
    ListarProyectosController
};