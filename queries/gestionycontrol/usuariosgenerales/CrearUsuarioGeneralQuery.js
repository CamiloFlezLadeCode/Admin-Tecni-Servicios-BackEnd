const { query } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

const RegistrarUsuarioGeneralQuery = async (DatosUsuarioGeneral) => {
    const sql = `
        INSERT INTO 
            usuario 
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
    return query(sql, [
        DatosUsuarioGeneral.Documento,
        DatosUsuarioGeneral.TipoDocumento,
        DatosUsuarioGeneral.Nombres,
        DatosUsuarioGeneral.Apellidos,
        DatosUsuarioGeneral.Correo,
        DatosUsuarioGeneral.Direccion,
        DatosUsuarioGeneral.Telefono,
        DatosUsuarioGeneral.Celular,
        DatosUsuarioGeneral.UsuarioCreacion,
        FechaActualColombia(),
        DatosUsuarioGeneral.Estado
    ]);
};
const RegistrarRolUsuarioGeneralQuery = async (DocumentoUsuario, Rol) => {
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
const RegistrarNivelUsuarioGeneralQuery = async (DocumentoUsuario, Nievl) => {
    const sql = `
        INSERT INTO usuario_niveles
            (
                DocumentoUsuario,
                IdNivel
            )
        VALUES
            ( ?, ? )
    `;
    return await query(sql, [
        DocumentoUsuario, Nivel
    ])
};
module.exports = {
    RegistrarUsuarioGeneralQuery,
    RegistrarRolUsuarioGeneralQuery,
    RegistrarNivelUsuarioGeneralQuery
};