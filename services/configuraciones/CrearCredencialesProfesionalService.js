const { CrearCredencialesProfesionalQuery } = require('../../queries/configuraciones/CrearCredencialesProfesionalQuery');
const { hashUserPassword } = require('../../utils/hashing_argon2/hashing_argon');

const CrearCredencialesProfesionalService = async (DatosCredenciales) => {
    const PasswordHashed = await hashUserPassword(DatosCredenciales.Password);
    const Data = {
        User: DatosCredenciales.User,
        Password: PasswordHashed,
        DocumentoProfesional: DatosCredenciales.DocumentoProfesional,
        DocumentoUsuario: DatosCredenciales.DocumentoUsuario,
        Accion: DatosCredenciales.Accion,
    };
    return await CrearCredencialesProfesionalQuery(Data);
};
module.exports = {
    CrearCredencialesProfesionalService
};