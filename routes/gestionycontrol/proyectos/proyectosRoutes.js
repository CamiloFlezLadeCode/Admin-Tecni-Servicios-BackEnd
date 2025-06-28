const express = require('express');
const router = express.Router();
const { CrearProyectoController } = require('../../../controllers/gestionycontrol/proyectos/CrearProyectoController');
const { ConsultarProyectosController } = require('../../../controllers/gestionycontrol/proyectos/ConsultarProyectoController');
const { ConsultarProyectoPorIdController } = require('../../../controllers/gestionycontrol/proyectos/ConsultarProyectoPorIdController');
const { ActualizarProyectoController } = require('../../../controllers/gestionycontrol/proyectos/ActualizarProyectoController');

router.post('/crear-proyecto', CrearProyectoController);
router.get('/ver-proyectos', ConsultarProyectosController);
router.get('/ver-proyecto-por-id', ConsultarProyectoPorIdController);
router.put('/actualizar-proyecto', ActualizarProyectoController);
module.exports = router;