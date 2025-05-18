const express = require('express');
const router = express.Router();
const { obtenerCredenciales } = require('../../controllers/login/loginController');
const verificarToken = require('../../middlewares/authMiddleware');

router.post('/login', obtenerCredenciales); // Cambiado a POST para enviar credenciales

router.get('/perfil', verificarToken, (req, res) => {
  res.status(200).json({
    nombre: req.user.nombre,
    documento: req.user.documento,
    correo: req.user.correo,
  });
});

//Se retira la cooke con el token
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Sesión cerrada' });
});
module.exports = router;