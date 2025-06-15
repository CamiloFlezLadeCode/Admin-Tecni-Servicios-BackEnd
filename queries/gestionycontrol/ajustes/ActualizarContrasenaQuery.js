const { query } = require('../../../config/db');

const ActualizarContrasenaQuery = async (DatosCredenciales) => {
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
        DatosCredenciales.DocumentoUsuarioActivo,
    ]);
};
module.exports = {
    ActualizarContrasenaQuery
};