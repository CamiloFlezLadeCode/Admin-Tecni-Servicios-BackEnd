const express = require('express');
const router = express.Router();
const { CrearOrdenDeServicioController } = require('../../../controllers/comercial/ordenes_de_servicio/CrearOrdenDeServicioController');
const { ConsultarSiguienteNoOrdenDeServicioController } = require('../../../controllers/comercial/ordenes_de_servicio/ConsultarSiguienteNoOrdenDeServicioController');
const { VerTodasLasOrdenesDeServicioController } = require('../../../controllers/comercial/ordenes_de_servicio/VerTodasLasOrdenesDeServicioController');
const { GenerarPDFOrdenDeServicioController } = require('../../../controllers/comercial/ordenes_de_servicio/GenerarPDFOrdenDeServicioController');
const { EliminarOrdenDeServicioController } = require('../../../controllers/comercial/ordenes_de_servicio/EliminarOrdenDeServicioController');

router.post('/crear-orden-de-servicio', CrearOrdenDeServicioController);
router.get('/siguiente-no-orden-de-servicio', ConsultarSiguienteNoOrdenDeServicioController);
router.get('/ver-todas-las-ordenes-de-servicio', VerTodasLasOrdenesDeServicioController);
router.get('/obtener-pdf-orden-de-servicio', GenerarPDFOrdenDeServicioController);
router.delete('/eliminar-orden-de-servicio', EliminarOrdenDeServicioController);
module.exports = router;