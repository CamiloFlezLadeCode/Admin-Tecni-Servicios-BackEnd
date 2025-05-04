const express = require('express');
const router = express.Router();
const { CrearEquipoController } = require('../../../controllers/gestionycontrol/equipos/CrearEquipoController');
const { ConsultarEquiposController } = require('../../../controllers/gestionycontrol/equipos/ConsultarEquiposController');


router.post('/crear-equipo', CrearEquipoController);
router.get('/ver-equipos', ConsultarEquiposController);
module.exports = router;