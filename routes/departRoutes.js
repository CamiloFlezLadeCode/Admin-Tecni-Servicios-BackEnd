// routes/usuarioRoutes.js
const express = require('express');
const { ObtenerDepartamentos } = require('../controllers/prueba'); // Ajustá la ruta si es necesario

const router = express.Router();

// Ruta para obtener usuarios
router.get('/departamentos', ObtenerDepartamentos);

// Otras rutas pueden ir aquí...

module.exports = router;
