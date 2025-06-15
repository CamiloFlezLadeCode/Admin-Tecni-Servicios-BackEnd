const { query } = require('../../../config/db');

const ActualizarInfoUsuarioQuery = async (InfoUsuario) => {
    const sql = `
        UPDATE 
            usuario 
        SET 
            Nombres = ?, 
            Apellidos = ?, 
            Correo = ?, 
            Direccion = ?, 
            Celular = ? 
        WHERE 
            DocumentoUsuario = ?;
    `;
    return query(sql, [
        InfoUsuario.NombresUsuario,
        InfoUsuario.ApellidosUsuario,
        InfoUsuario.CorreoUsuario,
        InfoUsuario.DireccionUsuario,
        InfoUsuario.CelularUsuario,
        InfoUsuario.DocumentoUsuario
    ]);
};
module.exports = {
    ActualizarInfoUsuarioQuery
};