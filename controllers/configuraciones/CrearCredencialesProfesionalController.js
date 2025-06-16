const { CrearCredencialesProfesionalService } = require('../../services/configuraciones/CrearCredencialesProfesionalService');

const CrearCredencialesProfesionalController = async (req, res) => {
    try {
        const DatosCredenciales = req.body;
        await CrearCredencialesProfesionalService(DatosCredenciales);
        console.log('Credenciales del profesional creadas correctamente');
        return res.status(200).json();
    } catch (error) {
        console.error('Error en CrearCredencialesProfesionalController => ', error);
        res.status(500).json({ error: `Error al crear las credenciales del profesional => ${error}` });
    }
};
module.exports = {
    CrearCredencialesProfesionalController
};