const express = require('express');
const router = express.Router();
const { ListarEquiposPropiosController } = require('../../../controllers/inventario/equipos/ListarEquiposPropiosController');
const { ConsultarSiguienteNoEntradaEquipoController } = require('../../../controllers/inventario/equipos/ConsultarSiguienteNoEntradaEquipoController');
const { GuardarEntradaEquiposController } = require('../../../controllers/inventario/equipos/GuardarEntradaEquiposController');
const { ConsultarEntradasDeEquiposController } = require('../../../controllers/inventario/equipos/ConsultarEntradasDeEquiposController');
const { VisualizarEntradaEquiposController } = require('../../../controllers/inventario/equipos/VisualizarEntradaEquiposController');

router.get('/listar-equipos-propios', ListarEquiposPropiosController);
router.get('/siguiente-no-entrada-equipos', ConsultarSiguienteNoEntradaEquipoController);
router.post('/guardar-entrada-equipos', GuardarEntradaEquiposController);
router.get('/ver-entradas-de-equipos', ConsultarEntradasDeEquiposController);
router.get('/visualizar-entrada-equipos', VisualizarEntradaEquiposController);
module.exports = router;