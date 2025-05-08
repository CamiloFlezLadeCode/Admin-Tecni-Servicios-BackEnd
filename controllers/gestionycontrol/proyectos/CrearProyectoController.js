const { CrearProyectoService } = require('../../../services/gestionycontrol/proyectos/CrearProyectoService');

const CrearProyectoController = async (req, res) => {
    try {
        const proyectoData = req.body;
        if (!proyectoData.UsuarioCreacion) {
            return res.status(400).json({ error: 'UsuarioCreacion es requerido' });
        }
        const resultado = await CrearProyectoService(proyectoData);
        console.log("Proyecto creado correctamente");
        res.status(200).json({ message: 'Proyecto creado correctamente', data: resultado });
    } catch (error) {
        console.error('Error en CrearProyectoController => ', error);
        res.status(500).json({ error: `Error al crear proyecto => ${error}` });
    }
};
module.exports = {
    CrearProyectoController
};