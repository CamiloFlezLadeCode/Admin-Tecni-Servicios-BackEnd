const { query } = require('../../config/db');

const obtenerCredenciales = async (clienteData) => {
    const sql = `
        SELECT
            DocumentoUsuario, ClaveUsuario
        FROM
            Credenciales
        WHERE
            NombreUsuario = ? COLLATE utf8mb4_bin AND ClaveUsuario = ? COLLATE utf8mb4_bin
    `;
    return await query(sql, [clienteData.NombreUsuario, clienteData.ClaveUsuario]);
};

const obtenerRol = async (documentoUsuario) => {
    const sql = `
        SELECT 
            roles.Rol 
        FROM
            usuario_roles
        INNER JOIN
            roles ON usuario_roles.IdRol = roles.IdRol
        WHERE
            usuario_roles.DocumentoUsuario = ? COLLATE utf8mb4_bin
    `;
    return await query(sql, [documentoUsuario]);
};

const obtenerNombre = async (documentoUsuario) => {
    const sql = `
        SELECT 
            SUBSTRING_INDEX(Nombres, ' ', 1) AS Nombre
        FROM
            usuario
        WHERE
            DocumentoUsuario = ? COLLATE utf8mb4_bin
    `;
    return await query(sql, [documentoUsuario]);
};

const obtenerDocumento = async (documentoUsuario) => {
    const sql = `
        SELECT
            DocumentoUsuario
        FROM   
            usuario
        WHERE
            DocumentoUsuario = ? COLLATE utf8mb4_bin
    `;
    return await query(sql, [documentoUsuario]);
};

const obtenerCorreo = async (documentoUsuario) => {
    const sql = `
        SELECT
            Correo
        FROM
            usuario
        WHERE
            DocumentoUsuario = ? COLLATE utf8mb4_bin
    `;
    return await query(sql, [documentoUsuario]);
};  

module.exports = {
    obtenerCredenciales,
    obtenerRol,
    obtenerNombre,
    obtenerDocumento,
    obtenerCorreo
};
