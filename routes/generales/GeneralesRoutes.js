const express = require('express');
const router = express.Router();
const { ConsultarListarClientesController } = require('../../controllers/generales/ClientesController');

router.get('/listar-clientes', ConsultarListarClientesController);
module.exports = router;