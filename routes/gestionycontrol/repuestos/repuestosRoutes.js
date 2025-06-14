const express = require('express');
const router = express.Router();
const { CrearRepuestoController } = require('../../../controllers/gestionycontrol/repuestos/CrearRepuestoController');
const { ConsultarRepuestosController } = require('../../../controllers/gestionycontrol/repuestos/ConsultarRepuestosController');
const { ConsultarRepuestoPorIdController } = require('../../../controllers/gestionycontrol/repuestos/ConsultarRepuestoPorIdController');
const { ActualizarRepuestoController } = require('../../../controllers/gestionycontrol/repuestos/ActualizarRepuestoController');

router.post('/crear-repuesto', CrearRepuestoController);
router.get('/ver-repuestos', ConsultarRepuestosController);
router.get('/ver-repuesto/:IdRepuesto', ConsultarRepuestoPorIdController);
router.put('/actualizar-repuesto', ActualizarRepuestoController);
module.exports = router;