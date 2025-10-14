const { ActualizarCredencialesProfesionalPorAdministradorQuery } = require('../../queries/configuraciones/ActualizarCredencialesProfesionalPorAdministradorQuery');
const { hashUserPassword } = require('../../utils/hashing_argon2/hashing_argon');

const ActualizarCredencialesProfesionalPorAdministradorService = async (DatosCredenciales) => {
    const PasswordHashed = await hashUserPassword(DatosCredenciales.Password);
    const Data = {
        User: DatosCredenciales.User,
        Password: PasswordHashed,
        DocumentoProfesional: DatosCredenciales.DocumentoProfesional,
        DocumentoUsuario: DatosCredenciales.DocumentoUsuario,
        Accion: DatosCredenciales.Accion,
    }
    return await ActualizarCredencialesProfesionalPorAdministradorQuery(Data);
};
module.exports = {
    ActualizarCredencialesProfesionalPorAdministradorService
};