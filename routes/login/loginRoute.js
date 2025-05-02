const express = require('express');
const router = express.Router();
const { obtenerCredenciales } = require('../../controllers/login/loginController');

router.post('/login', obtenerCredenciales); // Cambiado a POST para enviar credenciales
module.exports = router;
