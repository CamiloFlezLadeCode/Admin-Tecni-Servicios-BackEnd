const { query } = require('../../../config/db');

const crearUsuarioQuery = async (usuarioData) => {
    const now = new Date();
    const timeZone = 'America/Bogota';
    
    const options = {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };
    
    // Devuelve string como "03/05/2025, 15:47:22"
    const formatted = new Intl.DateTimeFormat('es-CO', options).format(now);
    
    // Convertir a formato SQL: yyyy-MM-dd HH:mm:ss
    const [datePart, timePart] = formatted.split(', ');
    const [day, month, year] = datePart.split('/');
    const FechaCreacion = `${year}-${month}-${day} ${timePart}`;
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
        FechaCreacion,
        usuarioData.Estado
    ]);
};
const crearRolUsuarioQuery = async (DocumentoUsuario, Rol) => {
    const sql = `
        INSERT INTO usuarioroles 
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