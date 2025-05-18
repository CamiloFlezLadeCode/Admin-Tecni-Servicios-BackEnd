const { query } = require('../../../config/db');

const ConsultarMecanicosQuery = async () => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    const sql = `
        -- Consulta principal
        SELECT 
            usu.IdUsuario AS IdUsuario,
            CONCAT(COALESCE(usu.Nombres, ''), ' ', COALESCE(usu.Apellidos, '')) AS Nombre,
            tipodocumento.Codigo AS TipoDocumento,
            usu.DocumentoUsuario AS Documento,
            usu.Correo AS Correo,
            usu.Direccion AS Direccion,
            usu.Celular AS Celular,
            CONCAT(SUBSTRING_INDEX(COALESCE(usu2.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu2.Apellidos, ''), ' ', 1)) AS UsuarioCreacion,
            DATE_FORMAT(usu.FechaCreacion, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaCreacion, 
            estado.Estado AS Estado,
            rol.Rol AS Rol
        FROM 
            usuario usu
        INNER JOIN
            usuario usu2 ON usu.UsuarioCreacion = usu2.DocumentoUsuario
        INNER JOIN
            tipodocumento ON usu.TipoDocumento = tipodocumento.IdTipoDocumento
        INNER JOIN
            estado ON usu.IdEstado = estado.IdEstado
        INNER JOIN	
            usuario_roles usurol ON usu.DocumentoUsuario = usurol.DocumentoUsuario
        INNER JOIN
            roles rol ON usurol.IdRol = rol.IdRol
        WHERE	
            rol.Rol = 'Mecánico'
        ORDER BY
            usu.Nombres ASC, usu.Apellidos ASC;
    `;
    // const explain = await query(`EXPLAIN ${sql}`);
    // console.log(explain);
    return query(sql);
};
module.exports = {
    ConsultarMecanicosQuery
};