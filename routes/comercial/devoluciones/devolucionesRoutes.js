const express = require('express');
const router = express.Router();
const { MostrarRemisionesDelClienteController } = require('../../../controllers/comercial/devoluciones/MostrarRemisionesDelClienteController');
const { MostrarItemsRemisionController } = require('../../../controllers/comercial/devoluciones/MostrarItemsRemisionController');
const { ConsultarSiguienteNoDevolucionController } = require('../../../controllers/comercial/devoluciones/ConsultarSiguienteNoDevolucionController');

router.get('/ver-remisiones-cliente', MostrarRemisionesDelClienteController);
router.get('/ver-items-remision', MostrarItemsRemisionController);
router.get('/siguiente-no-devolucion', ConsultarSiguienteNoDevolucionController);
module.exports = router;