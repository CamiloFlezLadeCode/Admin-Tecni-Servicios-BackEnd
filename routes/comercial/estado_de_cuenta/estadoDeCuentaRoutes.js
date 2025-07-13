const express = require('express');
const router = express.Router();
const { VerEstadoDeCuentaController } = require('../../../controllers/comercial/estado_de_cuenta/VerEstadoDeCuentaController');

router.get('/ver-estado-de-cuenta-cliente', VerEstadoDeCuentaController);
module.exports = router;