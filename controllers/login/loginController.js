require('dotenv').config();
const jwt = require('jsonwebtoken');
const { obtenerCredencialesService } = require('../../services/login/loginService');

const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro';
// const JWT_EXPIRATION = '1h'; // puedes cambiar esto a lo que quieras
const JWT_EXPIRATION = '1d';

// const obtenerCredenciales = async (req, res) => {
//      console.log('Body completo:', req.headers);

//      console.log('Body completo:', req.body);
//     try {
//         const { NombreUsuario, ClaveUsuario } = req.body;

//         console.log(NombreUsuario)
//         if (!NombreUsuario || !ClaveUsuario) {
//             return res.status(400).json({ error: 'NombreUsuario y ClaveUsuario son requeridos' });
//         }

//         const { credenciales, rol, nombre, documento, correo, accesohabilitado } = await obtenerCredencialesService({ NombreUsuario, ClaveUsuario });

//         if (!credenciales) {
//             return res.status(401).json({ error: 'Credenciales incorrectas' });
//         }

//         if (!rol) {
//             return res.status(401).json({ error: 'Rol no encontrado para el usuario' });
//         }

//         let token;
//         if (accesohabilitado === true) {
//             // 🔐 Generar token JWT
//             token = jwt.sign(
//                 { id: credenciales, rol, nombre, documento, correo },
//                 JWT_SECRET,
//                 { expiresIn: JWT_EXPIRATION }
//             );
//         }
//         // // 🔐 Generar token JWT
//         // const token = jwt.sign(
//         //     { id: credenciales, rol, nombre, documento, correo },
//         //     JWT_SECRET,
//         //     { expiresIn: JWT_EXPIRATION }
//         // );

//         // 🍪 Enviar token como cookie HttpOnly
//         // res.cookie('token', token, {
//         //     httpOnly: true,
//         //     secure: process.env.NODE_ENV === 'production',
//         //     sameSite: 'strict',
//         //     maxAge: 60 * 60 * 1000, // 1 hora
//         // });

//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
//             // maxAge: 1000 * 60 * 60, // 1 hora
//             maxAge: 1000 * 60 * 60 * 24, // 1 día
//             path: '/',
//         });
//         // ✅ También puedes retornar parte de los datos si necesitas
//         res.status(200).json({ message: 'Login exitoso', rol, nombre, documento, correo, token, accesohabilitado });

//         console.log(`Token generado correctamente. Token: ${token}`);
//     } catch (error) {
//         console.error('Error en obtenerCredenciales => ', error);
//         res.status(500).json({ error: 'Error al obtener las credenciales', message: error.message });
//     }
// };


const obtenerCredenciales = async (req, res) => {
    try {
        const { data, key } = req.body;

        // Validaciones básicas
        if (!data || !key) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }

        if (typeof data !== 'string' || typeof key !== 'string') {
            return res.status(400).json({ error: 'Formato de datos inválido' });
        }

        if (key.length < 8) {
            return res.status(400).json({ error: 'Clave de sesión inválida' });
        }

        // Desencriptar
        let datosDecifrados;
        try {
            datosDecifrados = decryptCredentials(data, key);
        } catch (decryptError) {
            return res.status(400).json({ error: 'No se pudieron desencriptar los datos' });
        }

        // Parsear JSON
        let credencialesEncriptadas;
        try {
            credencialesEncriptadas = JSON.parse(datosDecifrados);
        } catch (parseError) {
            return res.status(400).json({ error: 'Formato de datos inválido' });
        }

        const { NombreUsuario, ClaveUsuario } = credencialesEncriptadas;

        if (!NombreUsuario || !ClaveUsuario) {
            return res.status(400).json({ error: 'Credenciales incompletas' });
        }

        // Validar longitud máxima (prevención de ataques)
        if (NombreUsuario.length > 50 || ClaveUsuario.length > 100) {
            return res.status(400).json({ error: 'Datos exceden longitud permitida' });
        }

        const { credenciales, rol, nombre, documento, correo, accesohabilitado } = await obtenerCredencialesService({ NombreUsuario, ClaveUsuario });

        if (!credenciales) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        let token;
        if (accesohabilitado === true) {
            // 🔐 Generar token JWT
            token = jwt.sign(
                { id: credenciales, rol, nombre, documento, correo },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRATION }
            );
        }

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            // maxAge: 1000 * 60 * 60, // 1 hora
            maxAge: 1000 * 60 * 60 * 24, // 1 día
            path: '/',
        });
        res.status(200).json({ message: 'Login exitoso', rol, nombre, documento, correo, token, accesohabilitado });
        console.log(`Token generado correctamente. Token: ${token}`);
    } catch (error) {
        console.error('Error en login => ', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const decryptCredentials = (encryptedData, key) => {
    try {
        // Usar Buffer para Node.js
        const decodedData = Buffer.from(encryptedData, 'base64').toString('binary');

        let result = '';
        for (let i = 0; i < decodedData.length; i++) {
            result += String.fromCharCode(
                decodedData.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }

        return result;
    } catch (error) {
        throw new Error('Error en desencriptación: ' + error.message);
    }
};

module.exports = {
    obtenerCredenciales
};