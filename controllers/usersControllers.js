const { query } = require('../config/db.js'); // Ajusta la ruta según tu estructura

// Obtener usuarios
async function obtenerUsuarios(req, res) {
    try {
        const usuarios = await query('SELECT * FROM usuario');
        console.log("USUARIOS OBTENIDOS CORRECTAMENTE...");
        return res.status(200).res.json(usuarios); // Enviar la respuesta con los usuarios
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return res.status(500).json({ error: 'Error al obtener usuarios' }); // Enviar error
    }
}

// Exportar función
module.exports = {
    obtenerUsuarios,
};