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
            usuarioroles
        INNER JOIN
            roles ON usuarioroles.IdRol = roles.IdRol
        WHERE
            usuarioroles.DocumentoUsuario = ? COLLATE utf8mb4_bin
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

module.exports = {
    obtenerCredenciales,
    obtenerRol,
    obtenerNombre,
    obtenerDocumento
};
