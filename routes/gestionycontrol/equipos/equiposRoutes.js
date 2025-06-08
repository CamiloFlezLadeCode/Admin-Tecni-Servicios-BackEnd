const express = require('express');
const router = express.Router();
const { CrearEquipoController } = require('../../../controllers/gestionycontrol/equipos/CrearEquipoController');
const { ConsultarEquiposController } = require('../../../controllers/gestionycontrol/equipos/ConsultarEquiposController');
const { ConsultarEquipoController } = require('../../../controllers/gestionycontrol/equipos/ConsultarEquipoController');
const { ActualizarEquipoController } = require('../../../controllers/gestionycontrol/equipos/ActualizarEquipoController');

router.post('/crear-equipo', CrearEquipoController);
router.get('/ver-equipos', ConsultarEquiposController);
router.get('/ver-equipo/:IdEquipo', ConsultarEquipoController);
router.put('/actualizar-equipo', ActualizarEquipoController);
module.exports = router;
