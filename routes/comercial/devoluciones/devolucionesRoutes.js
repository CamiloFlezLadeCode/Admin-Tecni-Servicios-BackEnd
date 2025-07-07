const express = require('express');
const router = express.Router();
const { MostrarRemisionesDelClienteController } = require('../../../controllers/comercial/devoluciones/MostrarRemisionesDelClienteController');
const { MostrarItemsRemisionController } = require('../../../controllers/comercial/devoluciones/MostrarItemsRemisionController');
const { ConsultarSiguienteNoDevolucionController } = require('../../../controllers/comercial/devoluciones/ConsultarSiguienteNoDevolucionController');
const { CrearDevolucionController } = require('../../../controllers/comercial/devoluciones/CrearDevolucionController');
const { VerTodasLasDevolucionesController } = require('../../../controllers/comercial/devoluciones/VerTodasLasDevolucionesController');
const { GenerarPDFDevolucionController } = require('../../../controllers/comercial/devoluciones/GenerarPDFDevolucionController');

router.get('/ver-remisiones-cliente', MostrarRemisionesDelClienteController);
router.get('/ver-items-remision', MostrarItemsRemisionController);
router.get('/siguiente-no-devolucion', ConsultarSiguienteNoDevolucionController);
router.post('/crear-devolucion', CrearDevolucionController);
router.get('/ver-todas-las-devoluciones', VerTodasLasDevolucionesController);
router.get('/obtener-pdf-devolucion', GenerarPDFDevolucionController);
module.exports = router;