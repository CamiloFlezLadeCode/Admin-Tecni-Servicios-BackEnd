const express = require('express');
const router = express.Router();
const { ConsultarInformacionUsuarioController } = require('../../../controllers/gestionycontrol/cuenta/ConsultarInformacionUsuarioController');

router.get('/ver-informacion-usuario/:DocumentoUsuario', ConsultarInformacionUsuarioController);
module.exports = router;