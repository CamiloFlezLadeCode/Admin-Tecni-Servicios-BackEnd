const { query } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

const CrearMecanicoQuery = async (mecanicoData) => {
    const sql = `
        INSERT INTO usuario 
            (
                DocumentoUsuario, 
                TipoDocumento, 
                Nombres, 
                Apellidos, 
                Correo, 
                Direccion,  
                Celular, 
                UsuarioCreacion, 
                FechaCreacion, 
                IdEstado
            ) 
            VALUES 
                ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );
    `;
    return query(sql, [
        mecanicoData.Documento,
        mecanicoData.TipoDocumento,
        mecanicoData.Nombres,
        mecanicoData.Apellidos,
        mecanicoData.Correo,
        mecanicoData.Direccion,
        mecanicoData.Celular,
        mecanicoData.UsuarioCreacion,
        FechaActualColombia(),
        mecanicoData.Estado,
    ]);
};
const CrearRolesQuery = async (DocumentoUsuario, Rol) => {
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
const CrearNivelQuery = async (DocumentoUsuario, Nivel) => {
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
    ]);
}
module.exports = {
    CrearMecanicoQuery,
    CrearRolesQuery,
    CrearNivelQuery
};


