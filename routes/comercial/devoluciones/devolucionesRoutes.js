const express = require('express');
const router = express.Router();
const { MostrarRemisionesDelClienteController } = require('../../../controllers/comercial/devoluciones/MostrarRemisionesDelClienteController');
const { MostrarItemsRemisionController } = require('../../../controllers/comercial/devoluciones/MostrarItemsRemisionController');

router.get('/ver-remisiones-cliente', MostrarRemisionesDelClienteController);
router.get('/ver-items-remision', MostrarItemsRemisionController);
module.exports = router;