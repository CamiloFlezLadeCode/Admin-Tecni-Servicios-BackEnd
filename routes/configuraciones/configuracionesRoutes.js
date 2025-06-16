const express = require('express');
const router = express.Router();
const { ConsultarProfesionalesPertenecientesController } = require('../../controllers/configuraciones/ConsultarProfesionalesPertenecientesController');
const { ConsultarCredencialesDelProfesionalController } = require('../../controllers/configuraciones/ConsultarCredencialesDelProfesionalController');
const { CrearCredencialesProfesionalController } = require('../../controllers/configuraciones/CrearCredencialesProfesionalController');
const { ActualizarCredencialesProfesionalPorAdministradorController } = require('../../controllers/configuraciones/ActualizarCredencialesProfesionalPorAdministradorController');

router.get('/ver-profesionales-pertenecientes', ConsultarProfesionalesPertenecientesController);
router.get('/consultar-credenciales-del-profesional/:DocumentoProfesional', ConsultarCredencialesDelProfesionalController);
router.post('/crear-credenciales-profesional', CrearCredencialesProfesionalController);
router.put('/actualizar-credenciales-profesional', ActualizarCredencialesProfesionalPorAdministradorController);
module.exports = router;