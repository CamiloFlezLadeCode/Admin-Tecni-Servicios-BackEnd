const { query } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

const crearUsuarioQuery = async (usuarioData) => {
    const sql = `
        INSERT INTO usuario 
            ( 
                DocumentoUsuario, 
                TipoDocumento, 
                Nombres, 
                Apellidos, 
                Correo, 
                Direccion, 
                Telefono, 
                Celular, 
                UsuarioCreacion,
                FechaCreacion,
                IdEstado
            ) 
            VALUES 
            ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )
    `;
    return await query(sql, [
        usuarioData.DocumentoUsuario,
        usuarioData.TipoDocumento,
        usuarioData.Nombres,
        usuarioData.Apellidos,
        usuarioData.Correo,
        usuarioData.Direccion,
        usuarioData.Telefono,
        usuarioData.Celular,
        usuarioData.UsuarioCreacion,
        FechaActualColombia(),
        usuarioData.Estado
    ]);
};
const crearRolUsuarioQuery = async (DocumentoUsuario, Rol) => {
    const sql = `
        INSERT INTO usuario_roles 
            (
                DocumentoUsuario, 
                IdRol
            ) 
        VALUES 
            ( ?, ? )
    `;
    return await query(sql, [
        DocumentoUsuario, Rol
    ]);
};
module.exports = {
    crearUsuarioQuery,
    crearRolUsuarioQuery
};