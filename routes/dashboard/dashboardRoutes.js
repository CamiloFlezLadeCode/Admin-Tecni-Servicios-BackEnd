const express = require('express');
const router = express.Router();
const { VerResumenDashboardController } = require('../../controllers/dashboard/VerResumenDashboardController');

router.get('/resumen-dashboard', VerResumenDashboardController);

module.exports = router;
