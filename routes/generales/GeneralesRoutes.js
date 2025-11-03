//Importación de herramientas
const express = require('express');
//...

//Se contruye el router de express
const router = express.Router();
//...

//Se importan los controladores a manejar
const { ConsultarListarClientesController } = require('../../controllers/generales/ClientesController');
const { ConsultarTiposDeDocumentosController } = require('../../controllers/generales/TipoDocumentosController');
const { ListarCategoriasController } = require('../../controllers/generales/CategoriasController');
const { ListarProyectosController } = require('../../controllers/generales/ProyectosController');
const { ListarEquiposController } = require('../../controllers/generales/EquiposController');
const { ListarNivelesController } = require('../../controllers/generales/NivelesController');
const { ListarRolesController } = require('../../controllers/generales/RolesController');
const { ListarEstadosController } = require('../../controllers/generales/EstadosController');
const { ConsultarSubarrendatariosController } = require('../../controllers/generales/SubarrendatariosController');
const { ListarBodeguerosController } = require('../../controllers/generales/BodeguerosController');
const { ListarDespachadoresController } = require('../../controllers/generales/DespachadoresController');
const { ListarTransportadoresController } = require('../../controllers/generales/TransportadoresController');
const { ListarVehiculosController } = require('../../controllers/generales/VehiculosController');
const { ListarMecanicosController } = require('../../controllers/generales/MecanicosController');
const { ListarTipoBodegaController } = require('../../controllers/generales/TipoBodegaController');
const { ListarTipoEquipoController } = require('../../controllers/generales/TipoEquipoController');
const { ListarUnidadesController } = require('../../controllers/generales/UnidadesController');
const { ListarBodegasPorSubarrendatarioController } = require('../../controllers/generales/BodegasPorSubarrendatarioController');
const { SiguienteNumeracion_Para_EntradaRepuestosController } = require('../../controllers/generales/SiguienteNumeracionController');
//...

//Se crean las rutas/apis con su respectivo controlador
router.get('/listar-clientes', ConsultarListarClientesController);
router.get('/listar-tipo-de-documentos', ConsultarTiposDeDocumentosController);
router.get('/listar-categorias', ListarCategoriasController);
router.get('/listar-proyectos', ListarProyectosController);
router.get('/listar-equipos', ListarEquiposController);
router.get('/listar-niveles', ListarNivelesController);
router.get('/listar-roles', ListarRolesController);
router.get('/listar-estados', ListarEstadosController);
router.get('/listar-subarrendatarios', ConsultarSubarrendatariosController);
router.get('/listar-bodegueros', ListarBodeguerosController);
router.get('/listar-despachadores', ListarDespachadoresController);
router.get('/listar-transportadores', ListarTransportadoresController);
router.get('/listar-vehiculos', ListarVehiculosController);
router.get('/listar-mecanicos', ListarMecanicosController);
router.get('/listar-tipo-de-bodegas', ListarTipoBodegaController);
router.get('/listar-tipo-de-equipos', ListarTipoEquipoController);
router.get('/listar-unidades-de-medida', ListarUnidadesController);
router.get('/listar-bodegas-subarrendatario', ListarBodegasPorSubarrendatarioController);
router.get('/siguiente-no-entrada-repuestos', SiguienteNumeracion_Para_EntradaRepuestosController);
//...

//Se exportan las rutas/apis para ser levantadas en el servidor
module.exports = router;
//...