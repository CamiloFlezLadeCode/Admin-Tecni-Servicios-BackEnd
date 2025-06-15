const express = require('express');
const router = express.Router();
const { ConsultarInformacionUsuarioController } = require('../../../controllers/gestionycontrol/cuenta/ConsultarInformacionUsuarioController');
const { GuardarAvatarController } = require('../../../controllers/gestionycontrol/cuenta/GuardarAvatarController');
const { ConsultarAvatarController } = require('../../../controllers/gestionycontrol/cuenta/ConsultarAvatarController');
const { ActualizarInfoUsuarioController } = require('../../../controllers/gestionycontrol/cuenta/ActualizarInfoUsuarioController');

router.get('/ver-informacion-usuario/:DocumentoUsuario', ConsultarInformacionUsuarioController);
router.post('/subir-avatar', GuardarAvatarController);
router.get('/mostrar-avatar/:DocumentoUsuarioActivo', ConsultarAvatarController);
router.put('/actualizar-informacion-usuario', ActualizarInfoUsuarioController);
module.exports = router;