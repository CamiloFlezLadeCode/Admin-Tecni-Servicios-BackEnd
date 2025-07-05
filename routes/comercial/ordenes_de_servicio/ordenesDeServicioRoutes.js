const express = require('express');
const router = express.Router();
const { CrearOrdenDeServicioController } = require('../../../controllers/comercial/ordenes_de_servicio/CrearOrdenDeServicioController');
const { ConsultarSiguienteNoOrdenDeServicioController } = require('../../../controllers/comercial/ordenes_de_servicio/ConsultarSiguienteNoOrdenDeServicioController');

router.post('/crear-orden-de-servicio', CrearOrdenDeServicioController);
router.get('/siguiente-no-orden-de-servicio', ConsultarSiguienteNoOrdenDeServicioController);
module.exports = router;