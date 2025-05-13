const express = require('express');
const router = express.Router();
const { CrearProyectoController } = require('../../../controllers/gestionycontrol/proyectos/CrearProyectoController');
const { ConsultarProyectosController } = require('../../../controllers/gestionycontrol/proyectos/ConsultarProyectoController');

router.post('/crear-proyecto', CrearProyectoController);
router.get('/ver-proyectos', ConsultarProyectosController);
module.exports = router;