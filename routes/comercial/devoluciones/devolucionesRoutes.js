const express = require('express');
const router = express.Router();
const { MostrarRemisionesDelClienteController } = require('../../../controllers/comercial/devoluciones/MostrarRemisionesDelClienteController');
const { MostrarItemsRemisionController } = require('../../../controllers/comercial/devoluciones/MostrarItemsRemisionController');
const { ConsultarSiguienteNoDevolucionController } = require('../../../controllers/comercial/devoluciones/ConsultarSiguienteNoDevolucionController');
const { CrearDevolucionController } = require('../../../controllers/comercial/devoluciones/CrearDevolucionController');
const { VerTodasLasDevolucionesController } = require('../../../controllers/comercial/devoluciones/VerTodasLasDevolucionesController');
const { GenerarPDFDevolucionController } = require('../../../controllers/comercial/devoluciones/GenerarPDFDevolucionController');
const { EliminarDevolucionController } = require('../../../controllers/comercial/devoluciones/EliminarDevolucionController');
const { MostrarSubarrendatariosConRemisionAsignadaController } = require('../../../controllers/comercial/devoluciones/MostrarSubarrendatariosConRemisionAsignadaController');
const { MostrarEquiposPorDevolverController } = require('../../../controllers/comercial/devoluciones/MostrarEquiposPorDevolverController');


router.get('/ver-remisiones-cliente', MostrarRemisionesDelClienteController);
router.get('/ver-items-remision', MostrarItemsRemisionController);
router.get('/siguiente-no-devolucion', ConsultarSiguienteNoDevolucionController);
router.post('/crear-devolucion', CrearDevolucionController);
router.get('/ver-todas-las-devoluciones', VerTodasLasDevolucionesController);
router.get('/obtener-pdf-devolucion', GenerarPDFDevolucionController);
router.delete('/eliminar-devolucion', EliminarDevolucionController);
router.get('/ver-subarrendatarios-con-remisiones-asignadas-para-cliente-proyecto', MostrarSubarrendatariosConRemisionAsignadaController);
router.get('/equipos-pendientes-por-devolver', MostrarEquiposPorDevolverController);
module.exports = router;