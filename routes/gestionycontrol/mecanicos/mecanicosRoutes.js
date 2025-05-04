const express = require('express');
const router = express.Router();
const { CrearMecanicoController } = require('../../../controllers/gestionycontrol/mecanicos/CrearMecanicoController');
const { ConsultarMecanicosController } = require('../../../controllers/gestionycontrol/mecanicos/ConsultarMecanicosController');

router.post('/crear-mecanico', CrearMecanicoController);
router.get('/ver-mecanicos', ConsultarMecanicosController);
module.exports = router;