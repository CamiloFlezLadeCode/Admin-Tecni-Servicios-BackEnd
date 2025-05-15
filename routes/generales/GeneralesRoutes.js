const express = require('express');
const router = express.Router();
const { ConsultarListarClientesController } = require('../../controllers/generales/ClientesController');
const { ConsultarTiposDeDocumentosController } = require('../../controllers/generales/TipoDocumentosController');
const { ListarReferenciasController } = require('../../controllers/generales/ReferenciasController');
const { ListarProyectosController } = require('../../controllers/generales/ProyectosController');

router.get('/listar-clientes', ConsultarListarClientesController);
router.get('/listar-tipo-de-documentos', ConsultarTiposDeDocumentosController);
router.get('/listar-referencias', ListarReferenciasController);
router.get('/listar-proyectos', ListarProyectosController);
module.exports = router;