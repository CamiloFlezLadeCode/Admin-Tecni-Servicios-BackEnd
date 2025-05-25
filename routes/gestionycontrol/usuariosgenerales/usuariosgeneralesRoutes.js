const express = require('express');
const router = express.Router();
const { CrearUsuarioGeneralController } = require('../../../controllers/gestionycontrol/usuariosgenerales/CrearUsuarioGeneralController');
const { ConsultarUsuariosGeneralesController } = require('../../../controllers/gestionycontrol/usuariosgenerales/ConsultarUsuariosGeneralesController');
const { ConsultarUsuarioGeneralPorDocumentoController } = require('../../../controllers/gestionycontrol/usuariosgenerales/ConsultarUsuarioGeneralPorDocumentoController');
const { ActualizarUsuarioGeneralController } = require('../../../controllers/gestionycontrol/usuariosgenerales/ActualizarUsuarioGeneralController');

router.post('/crear-usuario-general', CrearUsuarioGeneralController);
router.get('/ver-usuarios-generales', ConsultarUsuariosGeneralesController);
router.get('/ver-usuario-general/:DocumentoUsuarioGeneral', ConsultarUsuarioGeneralPorDocumentoController);
router.put('/actualizar-usuario-general', ActualizarUsuarioGeneralController);
module.exports = router;