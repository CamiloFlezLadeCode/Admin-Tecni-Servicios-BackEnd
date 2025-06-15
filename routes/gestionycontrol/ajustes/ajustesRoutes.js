const express = require('express');
const router = express.Router();
const { ActualizarContrasenaController } = require('../../../controllers/gestionycontrol/ajustes/ActualizarContrasenaController');

router.put('/actualizar-credenciales', ActualizarContrasenaController);
module.exports = router;