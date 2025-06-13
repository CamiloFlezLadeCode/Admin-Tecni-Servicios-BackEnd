const { query } = require('../../../config/db');

const ConsultarRepuestosQuery = async () => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    const sql = `
        SELECT	
            repu.IdRepuesto AS IdRepuesto,
            repu.Nombre AS NombreRepuesto,
            repu.Cantidad AS CantidadRepuesto,   
            #CONCAT(COALESCE(usu.Nombres, ''), ' ', SUBSTRING_INDEX(COALESCE(usu.Apellidos, ''), ' ', 1)) AS UsuarioCreacion,
            #IFNULL(CONCAT(COALESCE(usu.Nombres, ''), ' ', SUBSTRING_INDEX(COALESCE(usu.Apellidos, ''), ' ', 1)), 'Usuario desconocido') AS UsuarioCreacion,
            IFNULL(CONCAT(COALESCE(usu.Nombres, ''), ' ', SUBSTRING_INDEX(COALESCE(usu.Apellidos, NULL), ' ', 1)), 'Sin usuario de creación') AS UsuarioCreacion,
            CONCAT(DAYNAME(repu.FechaCreacion), ' ', DATE_FORMAT(repu.FechaCreacion, '%d/%m/%Y a las %l:%i:%s %p')) AS FechaCreacion,
            esta.Estado AS EstadoRepuesto
        FROM	
            repuestos AS repu
        LEFT JOIN	
            usuario AS usu ON repu.UsuarioCreacion = usu.DocumentoUsuario
        LEFT JOIN	
            estado AS esta ON repu.IdEstado = esta.IdEstado
        ORDER BY
            repu.Nombre ASC
    `;
    return query(sql);
};
module.exports = {
    ConsultarRepuestosQuery
};