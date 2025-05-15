const express = require('express');
const router = express.Router();
const { verClientes, insertarCliente, obtenerClientePorDocumento, crearClienteCompleto } = require('../../../controllers/gestionycontrol/clientes/clientesController');

router.get('/ver-clientes', verClientes);
router.post('/crearcliente', insertarCliente);
router.get('/buscarclientepordocumento/:DocumentoUsuario', obtenerClientePorDocumento);
router.post('/crearclientecompleto', crearClienteCompleto);
module.exports = router;