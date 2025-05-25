// const { obtenerCredencialesService } = require('../../services/login/loginService');

// const obtenerCredenciales = async (req, res) => {
//     try {
//         const clienteData = {
//             NombreUsuario: req.body.NombreUsuario,
//             ClaveUsuario: req.body.ClaveUsuario
//         };

//         if (!clienteData.NombreUsuario || !clienteData.ClaveUsuario) {
//             return res.status(400).json({ error: 'NombreUsuario y ClaveUsuario son requeridos' });
//         }

//         const { credenciales, rol, nombre, documento, correo } = await obtenerCredencialesService(clienteData);

//         if (!credenciales) {
//             return res.status(401).json({ error: 'Credenciales incorrectas' });
//         }

//         if (!rol) {
//             return res.status(401).json({ error: 'Rol no encontrado para el usuario' });
//         }

//         console.log(`CREDENCIALES => ${credenciales}, ROL => ${rol}`);

//         res.status(200).json({ credenciales, rol, nombre, documento, correo });
//     } catch (error) {
//         console.error('Error en obtenerCredenciales => ', error);
//         res.status(500).json({ error: 'Error al obtener las credenciales', message: error.message });
//     }
// };

// module.exports = {
//     obtenerCredenciales
// };

require('dotenv').config();
const jwt = require('jsonwebtoken');
const { obtenerCredencialesService } = require('../../services/login/loginService');

const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro';
// const JWT_EXPIRATION = '1h'; // puedes cambiar esto a lo que quieras
const JWT_EXPIRATION = '1d';

const obtenerCredenciales = async (req, res) => {
    try {
        const { NombreUsuario, ClaveUsuario } = req.body;

        if (!NombreUsuario || !ClaveUsuario) {
            return res.status(400).json({ error: 'NombreUsuario y ClaveUsuario son requeridos' });
        }

        const { credenciales, rol, nombre, documento, correo, accesohabilitado } = await obtenerCredencialesService({ NombreUsuario, ClaveUsuario });

        if (!credenciales) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        if (!rol) {
            return res.status(401).json({ error: 'Rol no encontrado para el usuario' });
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
        // // 🔐 Generar token JWT
        // const token = jwt.sign(
        //     { id: credenciales, rol, nombre, documento, correo },
        //     JWT_SECRET,
        //     { expiresIn: JWT_EXPIRATION }
        // );

        // 🍪 Enviar token como cookie HttpOnly
        // res.cookie('token', token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'strict',
        //     maxAge: 60 * 60 * 1000, // 1 hora
        // });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            // maxAge: 1000 * 60 * 60, // 1 hora
            maxAge: 1000 * 60 * 60 * 24, // 1 día
            path: '/',
        });
        // ✅ También puedes retornar parte de los datos si necesitas
        res.status(200).json({ message: 'Login exitoso', rol, nombre, documento, correo, token, accesohabilitado });

        console.log(`Token generado correctamente. Token: ${token}`);
    } catch (error) {
        console.error('Error en obtenerCredenciales => ', error);
        res.status(500).json({ error: 'Error al obtener las credenciales', message: error.message });
    }
};

module.exports = {
    obtenerCredenciales
};