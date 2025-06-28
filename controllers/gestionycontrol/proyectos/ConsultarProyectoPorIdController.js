const { ConsultarProyectoPorIdService } = require('../../../services/gestionycontrol/proyectos/ConsultarProyectoPorIdService');

const ConsultarProyectoPorIdController = async (req, res) => {
    try {
        // const { IdProyecto } = req.params; // Con parámetro en la ruta
        const { IdProyecto } = req.query; // Con parámetro en la petición
        const Proyecto = await ConsultarProyectoPorIdService(IdProyecto);
        if (Proyecto.length > 0) {
            console.log('Información del proyecto obtenida correctamente.');
        }
        return res.status(200).json(Proyecto);
    } catch (error) {
        console.error('Error en ConsultarProyectoPorIdController => ', error);
        return res.status(500).json({ error: `Error al consultar la inforamción del proyecto => ${error}` });
    }
};
module.exports = {
    ConsultarProyectoPorIdController
};