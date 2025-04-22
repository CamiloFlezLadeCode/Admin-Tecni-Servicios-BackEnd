// routes/usuarioRoutes.js
const express = require('express');
const { obtenerUsuarios } = require('../controllers/usersControllers'); // Ajustá la ruta si es necesario

const router = express.Router();

// Ruta para obtener usuarios
router.get('/usuarios', obtenerUsuarios);

// Otras rutas pueden ir aquí...

module.exports = router;
