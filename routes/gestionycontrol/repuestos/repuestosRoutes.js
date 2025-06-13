const express = require('express');
const router = express.Router();
const { CrearRepuestoController } = require('../../../controllers/gestionycontrol/repuestos/CrearRepuestoController');
const { ConsultarRepuestosController } = require('../../../controllers/gestionycontrol/repuestos/ConsultarRepuestosController');

router.post('/crear-repuesto', CrearRepuestoController);
router.get('/ver-repuestos', ConsultarRepuestosController);
module.exports = router;