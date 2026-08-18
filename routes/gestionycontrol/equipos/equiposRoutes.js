const express = require('express');
const router = express.Router();
const { CrearEquipoController } = require('../../../controllers/gestionycontrol/equipos/CrearEquipoController');
const { ConsultarEquiposController } = require('../../../controllers/gestionycontrol/equipos/ConsultarEquiposController');
const { ConsultarEquipoController } = require('../../../controllers/gestionycontrol/equipos/ConsultarEquipoController');
const { ActualizarEquipoController } = require('../../../controllers/gestionycontrol/equipos/ActualizarEquipoController');
const { ConsultarUbicacionEquipoController } = require('../../../controllers/gestionycontrol/equipos/ConsultarUbicacionEquipoController');

router.post('/crear-equipo', CrearEquipoController);
router.get('/ver-equipos', ConsultarEquiposController);
router.get('/ver-equipo/:IdEquipo', ConsultarEquipoController);
router.put('/actualizar-equipo', ActualizarEquipoController);
// Dónde está un equipo: cliente, proyecto, dirección y desde cuándo.
router.get('/ver-ubicacion-equipo/:IdEquipo', ConsultarUbicacionEquipoController);
module.exports = router;
