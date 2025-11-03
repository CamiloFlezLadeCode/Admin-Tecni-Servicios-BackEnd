const express = require('express');
const router = express.Router();
const { GuardarEntradaRepuestosController } = require('../../../controllers/inventario/repuestos/GuardarEntradaRepuestosController');
const { ListarRepuestosController } = require('../../../controllers/inventario/repuestos/ListarRepuestosController');
const { ConsultarEntradasRepuestosController } = require('../../../controllers/inventario/repuestos/ConsultarEntradasRepuestosController');
const { VisualizarEntradaRepuestosController } = require('../../../controllers/inventario/repuestos/VisualizarEntradaRepuestosController');

router.post('/guardar-entrada-repuestos', GuardarEntradaRepuestosController);
router.get('/listar-repuestos', ListarRepuestosController);
router.get('/ver-entradas-de-repuestos', ConsultarEntradasRepuestosController);
router.get('/visualizar-entrada-repuestos', VisualizarEntradaRepuestosController);
module.exports = router;