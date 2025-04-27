const express = require('express');
const router = express.Router();
const { verClientes, insertarCliente } = require('../../controllers/gestionycontrol/clientesController');

router.get('/verclientes', verClientes);
router.post('/crearcliente', insertarCliente);

module.exports = router;