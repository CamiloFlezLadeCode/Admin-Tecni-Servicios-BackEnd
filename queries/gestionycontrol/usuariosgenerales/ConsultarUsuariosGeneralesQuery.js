const { query } = require('../../../config/db');

const ConsultarUsuariosGeneralesQuery = async () => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    const sql = `
        SELECT
        usu.IdUsuario,
        #su.Nombres AS Nombre,
        CONCAT(COALESCE(usu.Nombres, ''), ' ', COALESCE(usu.Apellidos, '')) AS Nombre,
        tipodocu.Codigo AS TipoDocumento,
        usu.DocumentoUsuario AS Documento,
        usu.Correo AS Correo,
        usu.Direccion AS Direccion,
        usu.Telefono AS Telefono,
        usu.Celular AS Celular,
        GROUP_CONCAT(rol.Rol SEPARATOR ', ') AS RolesLabel,
        GROUP_CONCAT(rol.IdRol SEPARATOR ', ') AS RolesValue,
        nivel.Nivel AS Nivel,
        CONCAT(SUBSTRING_INDEX(COALESCE(usu2.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu2.Apellidos, ''), ' ', 1)) AS UsuarioCreacion,DATE_FORMAT(usu.FechaCreacion, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaCreacion,
        esta.Estado AS Estado,
        usu.Contacto AS Contacto
        FROM
        usuario AS usu 
        LEFT JOIN 
        usuario_roles AS usurol ON usu.DocumentoUsuario = usurol.DocumentoUsuario
        LEFT JOIN 
        roles AS rol ON usurol.IdRol = rol.IdRol
        LEFT JOIN
        usuario_niveles AS usunivel ON usu.DocumentoUsuario = usunivel.DocumentoUsuario
        LEFT JOIN
        niveles AS nivel ON usunivel.IdNivel = nivel.IdNivel
        INNER JOIN
        usuario AS usu2 ON usu.UsuarioCreacion = usu2.DocumentoUsuario
        INNER JOIN
        tipodocumento AS tipodocu ON usu.TipoDocumento = tipodocu.IdTipoDocumento
        INNER JOIN
        estado AS esta ON usu.IdEstado = esta.IdEstado
        GROUP BY
        usu.IdUsuario, usu.Nombres
        ORDER BY	
        usu.Nombres ASC;
    `;
    return query(sql);
};
module.exports = {
    ConsultarUsuariosGeneralesQuery
};