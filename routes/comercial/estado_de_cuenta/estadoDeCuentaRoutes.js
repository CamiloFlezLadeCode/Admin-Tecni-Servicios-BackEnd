const express = require('express');
const router = express.Router();
const { VerEstadoDeCuentaController } = require('../../../controllers/comercial/estado_de_cuenta/VerEstadoDeCuentaController');
const { InformeClienteEquiposEnObraController } = require('../../../controllers/comercial/estado_de_cuenta/InformeClienteEquiposEnObraController');
const { InformeInternoEmpresaEquiposEnObraController } = require('../../../controllers/comercial/estado_de_cuenta/InformeInternoEmpresaEquiposEnObraController');

router.get('/ver-estado-de-cuenta-cliente', VerEstadoDeCuentaController);
router.get('/informe-cliente-equipos-en-obra', InformeClienteEquiposEnObraController);
router.get('/informe-interno-empresa-equipos-en-obra', InformeInternoEmpresaEquiposEnObraController);
module.exports = router;
