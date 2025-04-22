const { query } = require('../config/db.js'); // Ajusta la ruta según tu estructura

// Obtener usuarios
async function obtenerUsuarios(req, res) {
    try {
        const usuarios = await query('SELECT * FROM usuario');
        console.log("USUARIOS OBTENIDOS CORRECTAMENTE...");
        res.json(usuarios); // Enviar la respuesta con los usuarios
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' }); // Enviar error
    }
}

// Exportar función
module.exports = {
    obtenerUsuarios,
};