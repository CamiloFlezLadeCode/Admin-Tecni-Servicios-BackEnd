const express = require('express');
const router = express.Router();
const { CrearRemisionController } = require('../../../controllers/comercial/remisiones/CrearRemisionController');
const { VerCantidadDisponibleController } = require('../../../controllers/comercial/remisiones/VerCantidadDisponibleController');
const { ConsultarSiguienteNoRemisionController } = require('../../../controllers/comercial/remisiones/ConsultarSiguienteNoRemisionController');
const { ConsultarRemisionesController } = require('../../../controllers/comercial/remisiones/ConsultarRemisionesController');
const { GenerarPDFRemisionController } = require('../../../controllers/comercial/remisiones/GenerarPDFController')
const { EliminarRemisionController } = require('../../../controllers/comercial/remisiones/EliminarRemisionController');
const { VerDisponibilidadEquiposController } = require('../../../controllers/comercial/remisiones/VerDisponibilidadEquiposController');

router.post('/crear-remision', CrearRemisionController);
router.get('/ver-cantidad-disponible-equipo/:IdEquipo', VerCantidadDisponibleController);
router.get('/siguiente-no-remision', ConsultarSiguienteNoRemisionController);
router.get('/ver-remisiones', ConsultarRemisionesController);
router.get('/obtener-pdf-remision/:IdRemision', GenerarPDFRemisionController);
router.delete('/eliminar-remision', EliminarRemisionController);
router.get('/ver-disponibilidad-equipos', VerDisponibilidadEquiposController);
module.exports = router;