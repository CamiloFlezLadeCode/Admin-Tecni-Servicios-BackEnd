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
            Celular1 = ?, 
            Celular2 = ? 
        WHERE 
            DocumentoUsuario = ?;
    `;
    return query(sql, [
        InfoUsuario.NombresUsuario,
        InfoUsuario.ApellidosUsuario,
        InfoUsuario.CorreoUsuario,
        InfoUsuario.DireccionUsuario,
        (InfoUsuario.Celular1Usuario || InfoUsuario.CelularUsuario || null),
        (InfoUsuario.Celular2Usuario || null),
        InfoUsuario.DocumentoUsuario
    ]);
};
module.exports = {
    ActualizarInfoUsuarioQuery
};