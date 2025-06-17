const express = require('express');
const { enviarRemisionController } = require('../../controllers/enviarcorreos/EnviarCorreosController');

const router = express.Router();

router.post('/enviar', enviarRemisionController);

module.exports = router;
