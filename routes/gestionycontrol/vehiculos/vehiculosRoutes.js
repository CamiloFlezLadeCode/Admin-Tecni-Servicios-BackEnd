const express = require('express');
const router = express.Router();
const { CrearVehiculoController } = require('../../../controllers/gestionycontrol/vehiculos/CrearVehiculoController');

router.post('/crear-vehiculo', CrearVehiculoController);
module.exports = router;