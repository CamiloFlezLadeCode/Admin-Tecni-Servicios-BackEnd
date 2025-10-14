const { obtenerCredenciales, obtenerRol, obtenerNombre, obtenerDocumento, obtenerCorreo } = require('../../queries/login/loginQueries');
const { verifyUserPassword } = require('../../utils/hashing_argon2/hashing_argon');

const obtenerCredencialesService = async (clienteData) => {
    try {
        const credenciales = await obtenerCredenciales(clienteData);

        if (!credenciales || credenciales.length === 0) {
            return { credenciales: null, rol: null, error: 'Usuario no encontrado' };
        }

        const passwordHash = credenciales[0].ClaveUsuario;
        const Access = await verifyUserPassword(clienteData.ClaveUsuario, passwordHash);

        if (!Access) {
            return { credenciales: null, rol: null, error: 'Contraseña incorrecta' };
        }

        const documentoUsuario = credenciales[0].DocumentoUsuario;
        const estadousuario = credenciales[0].Estado;

        const [rol, nombre, documento, correo] = await Promise.all([
            obtenerRol(documentoUsuario),
            obtenerNombre(documentoUsuario),
            obtenerDocumento(documentoUsuario),
            obtenerCorreo(documentoUsuario)
        ]);

        const accesohabilitado = estadousuario === 'Activo';

        return {
            credenciales,
            rol: rol[0]?.Rol ?? null,
            nombre: nombre[0]?.Nombre ?? null,
            documento: documento[0]?.DocumentoUsuario ?? null,
            correo: correo[0]?.Correo ?? null,
            accesohabilitado
        };

    } catch (error) {
        console.error('Error en obtenerCredencialesService:', error);
        throw new Error('Error interno del servidor');
    }
};


module.exports = {
    obtenerCredencialesService
};
