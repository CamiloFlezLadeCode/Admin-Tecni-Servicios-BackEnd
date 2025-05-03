const express = require('express');
const router = express.Router();
const { crearUsuarioController } = require('../../../controllers/gestionycontrol/usuarios/crearUsuarioController');

router.post('/crear-usuario', crearUsuarioController);
module.exports = router;