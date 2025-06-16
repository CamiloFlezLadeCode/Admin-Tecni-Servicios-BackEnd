const { ConsultarProfesionalesPertenecientesService } = require('../../services/configuraciones/ConsultarProfesionalesPertenecientesService');

const ConsultarProfesionalesPertenecientesController = async (req, res) => {
    try {
        const ProfesionalesPertenecientes = await ConsultarProfesionalesPertenecientesService();
        console.log(`Profesionales pertenecientes obteneidos correctamente. Total: ${ProfesionalesPertenecientes.length}`);
        const ProfesionalesPertenecientesMapeados = ProfesionalesPertenecientes.map(profesional => ({
            value: profesional.DocumentoProfesional,
            label: profesional.NombreProfesional
        }));
        return res.status(200).json(
            ProfesionalesPertenecientesMapeados
        );
    } catch (error) {
        console.error('Error en ConsultarProfesionalesPertenecientesController => ', error);
        res.status(500).json({ error: `Error al crear equipo => error` });
    }
};
module.exports = {
    ConsultarProfesionalesPertenecientesController
};