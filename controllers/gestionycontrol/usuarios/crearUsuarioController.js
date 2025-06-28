const { crearUsuarioService } = require('../../../services/gestionycontrol/usuarios/crearUsuarioService');

const crearUsuarioController = async (req, res) => {
    try {
        const usuarioData = req.body;
        if (!usuarioData.UsuarioCreacion) {
            return res.status(400).json({ error: 'UsuarioCreacion es requerido' });
        }

        const resultado = await crearUsuarioService(usuarioData);
        console.log("Usuario creado correctamente");
        return res.status(200).json({ message: 'Usuario insertado correctamente', data: resultado });
    } catch (error) {
        console.error('Error en crearUsuarioController => ', error);
        return res.status(500).json({ error: `Error al crear usuario => ${error}` });
    }
};
module.exports = {
    crearUsuarioController
};