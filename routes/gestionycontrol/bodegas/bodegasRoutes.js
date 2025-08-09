const express = require('express');
const router = express.Router();
const { CrearBodegaController } = require('../../../controllers/gestionycontrol/bodegas/CrearBodegaController');
const { VerBodegasController } = require('../../../controllers/gestionycontrol/bodegas/VerBodegasController');
const { ConsultarBodegaPorIdController } = require('../../../controllers/gestionycontrol/bodegas/ConsultarBodegaPorIdController');
const { ActualizarBodegaController } = require('../../../controllers/gestionycontrol/bodegas/ActualizarBodegaController');

router.post('/crear-bodega', CrearBodegaController);
router.get('/ver-bodegas', VerBodegasController);
router.get('/ver-bodega', ConsultarBodegaPorIdController);
router.put('/actualizar-bodega', ActualizarBodegaController);
module.exports = router;