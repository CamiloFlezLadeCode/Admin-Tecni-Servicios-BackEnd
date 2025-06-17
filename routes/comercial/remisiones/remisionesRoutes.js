const express = require('express');
const router = express.Router();
const { CrearRemisionController } = require('../../../controllers/comercial/remisiones/CrearRemisionController');
const { VerCantidadDisponibleController } = require('../../../controllers/comercial/remisiones/VerCantidadDisponibleController');
const { ConsultarSiguienteNoRemisionController } = require('../../../controllers/comercial/remisiones/ConsultarSiguienteNoRemisionController');
const { ConsultarRemisionesController } = require('../../../controllers/comercial/remisiones/ConsultarRemisionesController');

router.post('/crear-remision', CrearRemisionController);
router.get('/ver-cantidad-disponible-equipo/:IdEquipo', VerCantidadDisponibleController);
router.get('/siguiente-no-remision', ConsultarSiguienteNoRemisionController);
router.get('/ver-remisiones', ConsultarRemisionesController);
module.exports = router;