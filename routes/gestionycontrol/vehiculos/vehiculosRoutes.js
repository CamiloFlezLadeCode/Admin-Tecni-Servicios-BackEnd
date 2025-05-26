const express = require('express');
const router = express.Router();
const { CrearVehiculoController } = require('../../../controllers/gestionycontrol/vehiculos/CrearVehiculoController');
const { ConsultarVehiculosController } = require('../../../controllers/gestionycontrol/vehiculos/ConsultarVehiculosController');
const { ConsultarVehiculoController } = require('../../../controllers/gestionycontrol/vehiculos/ConsultarVehiculoController');
const { ActualizarVehiculoController } = require('../../../controllers/gestionycontrol/vehiculos/ActualizarVehiculoController');

router.post('/crear-vehiculo', CrearVehiculoController);
router.get('/ver-vehiculos', ConsultarVehiculosController);
router.get('/ver-vehiculo/:IdVehiculo', ConsultarVehiculoController);
router.put('/actualizar-vehiculo', ActualizarVehiculoController);
module.exports = router;