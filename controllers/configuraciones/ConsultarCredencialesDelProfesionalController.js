const { ConsultarCredencialesDelProfesionalService } = require('../../services/configuraciones/ConsultarCredencialesDelProfesionalService');

const ConsultarCredencialesDelProfesionalController = async (req, res) => {
    try {
        const { DocumentoProfesional } = req.params // Ó const DocumentoProfesional = req.params.DocumentoProfesional; También es lo mismo.
        const Credenciales = await ConsultarCredencialesDelProfesionalService(DocumentoProfesional);
        if (!Credenciales || Credenciales.length === 0) {
            console.log('El profesional no tiene credenciales creadas.');
            return res.status(200).json({ TieneCredenciales: 'NO' });
        }

        console.log('El profesional tiene credenciales creadas.');
        return res.status(200).json({ TieneCredenciales: `SI`, Credenciales: Credenciales });
    } catch (error) {
        console.error('Error en ConsultarCredencialesDelProfesionalController => ', error);
        res.status(500).json({ error: `Error al consultar las credenciales del profesional.`, detalle: error.message });
    }
};
module.exports = {
    ConsultarCredencialesDelProfesionalController
};