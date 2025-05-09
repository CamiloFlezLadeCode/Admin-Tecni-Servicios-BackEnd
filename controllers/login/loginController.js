const { obtenerCredencialesService } = require('../../services/login/loginService');

const obtenerCredenciales = async (req, res) => {
    try {
        const clienteData = {
            NombreUsuario: req.body.NombreUsuario,
            ClaveUsuario: req.body.ClaveUsuario
        };

        if (!clienteData.NombreUsuario || !clienteData.ClaveUsuario) {
            return res.status(400).json({ error: 'NombreUsuario y ClaveUsuario son requeridos' });
        }

        const { credenciales, rol, nombre, documento, correo } = await obtenerCredencialesService(clienteData);

        if (!credenciales) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        if (!rol) {
            return res.status(401).json({ error: 'Rol no encontrado para el usuario' });
        }

        console.log(`CREDENCIALES => ${credenciales}, ROL => ${rol}`);

        res.status(200).json({ credenciales, rol, nombre, documento, correo });
    } catch (error) {
        console.error('Error en obtenerCredenciales => ', error);
        res.status(500).json({ error: 'Error al obtener las credenciales', message: error.message });
    }
};

module.exports = {
    obtenerCredenciales
};
