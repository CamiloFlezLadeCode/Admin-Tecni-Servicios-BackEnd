const express = require('express');
const router = express.Router();
const { VerMovimientosGeneralesController } = require('../../../controllers/comercial/movimientos_generales/VerMovimientosGeneralesController');

router.get('/ver-movimientos-generales', VerMovimientosGeneralesController);

module.exports = router;
