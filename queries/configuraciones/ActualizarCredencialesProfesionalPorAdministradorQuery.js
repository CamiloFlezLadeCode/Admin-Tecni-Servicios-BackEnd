const { query } = require('../../config/db');

const ActualizarCredencialesProfesionalPorAdministradorQuery = async (DatosCredenciales) => {
    const sql = `
        UPDATE 
            credenciales 
        SET 
            NombreUsuario = ?, 
            ClaveUsuario = ? 
        WHERE 
            DocumentoUsuario = ?;
    `;
    return query(sql, [
        DatosCredenciales.User,
        DatosCredenciales.Password,
        DatosCredenciales.DocumentoProfesional
    ]);
};
module.exports = {
    ActualizarCredencialesProfesionalPorAdministradorQuery
};