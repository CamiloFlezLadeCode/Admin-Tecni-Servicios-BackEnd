const { ActualizarContrasenaQuery } = require('../../../queries/gestionycontrol/ajustes/ActualizarContrasenaQuery');
const { hashUserPassword } = require('../../../utils/hashing_argon2/hashing_argon');

const ActualizarContrasenaService = async (DatosCredenciales) => {
    const PasswordHashed = await hashUserPassword(DatosCredenciales.ConfirmPassword);
    const Data = {
        User: DatosCredenciales.User,
        Password: PasswordHashed,
        DocumentoUsuarioActivo: DatosCredenciales.DocumentoUsuarioActivo
    }
    return await ActualizarContrasenaQuery(Data);
};

module.exports = {
    ActualizarContrasenaService
};