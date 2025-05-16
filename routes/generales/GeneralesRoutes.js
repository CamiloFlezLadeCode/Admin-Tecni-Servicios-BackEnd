const express = require('express');
const router = express.Router();
const { ConsultarListarClientesController } = require('../../controllers/generales/ClientesController');
const { ConsultarTiposDeDocumentosController } = require('../../controllers/generales/TipoDocumentosController');
const { ListarCategoriasController } = require('../../controllers/generales/CategoriasController');
const { ListarProyectosController } = require('../../controllers/generales/ProyectosController');
const { ListarEquiposController } = require('../../controllers/generales/EquiposController');

router.get('/listar-clientes', ConsultarListarClientesController);
router.get('/listar-tipo-de-documentos', ConsultarTiposDeDocumentosController);
router.get('/listar-categorias', ListarCategoriasController);
router.get('/listar-proyectos', ListarProyectosController);
router.get('/listar-equipos', ListarEquiposController);
module.exports = router;