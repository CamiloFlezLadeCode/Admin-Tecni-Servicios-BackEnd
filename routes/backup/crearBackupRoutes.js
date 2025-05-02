const express = require('express');
const router = express.Router();
const { crearBackup } = require('../../controllers/backup/crearBackupController');


router.post('/crear-backup', crearBackup);
module.exports = router;