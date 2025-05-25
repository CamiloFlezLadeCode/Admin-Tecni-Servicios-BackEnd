//Para verificar token con seguridad por cookie
// // middlewares/authMiddleware.js
// const jwt = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro';

// const verificarToken = (req, res, next) => {
//     const token = req.cookies.token;
//     if (!token) return res.status(401).json({ error: 'No autorizado, token no presente' });
//     try {
//         const decoded = jwt.verify(token, JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         console.error('Error al verificar token:', err.message);
//         return res.status(403).json({ error: 'Token inválido o expirado' });
//     }
// };
// module.exports = verificarToken;



// //Para validar token por header con localStorage
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrae el token del "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }

    req.user = decoded; // Aquí se guarda la info decodificada
    next();
  });
};

module.exports = verificarToken;

