const express = require('express');
const router = express.Router();
const { CrearProyectoController } = require('../../../controllers/gestionycontrol/proyectos/CrearProyectoController');

router.post('/crear-proyecto', CrearProyectoController);
module.exports = router;