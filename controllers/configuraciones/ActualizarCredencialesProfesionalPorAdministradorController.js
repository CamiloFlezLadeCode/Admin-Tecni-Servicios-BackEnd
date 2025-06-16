const { ActualizarCredencialesProfesionalPorAdministradorService } = require('../../services/configuraciones/ActualizarCredencialesProfesionalPorAdministradorService');

const ActualizarCredencialesProfesionalPorAdministradorController = async (req, res) => {
    try {
        const DatosCredenciales = req.body;
        await ActualizarCredencialesProfesionalPorAdministradorService(DatosCredenciales);
        console.log('Credenciales del profesional actualizadas correctamente');
        return res.status(204).send();
    } catch (error) {
        console.error('Error en ActualizarCredencialesProfesionalPorAdministradorController => ', error);
        res.status(500).json({ error: `Error al crear equipo => error` });
    }
};
module.exports = {
    ActualizarCredencialesProfesionalPorAdministradorController
};