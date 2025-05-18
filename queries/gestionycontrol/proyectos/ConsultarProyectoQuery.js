const { query } = require('../../../config/db');

const ConsultarProyectosQuery = async () => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    const sql = `
        SELECT	
            proye.IdProyecto AS IdProyecto,
            proye.Nombre AS NombreProyecto,
            #CONCAT(SUBSTRING_INDEX(COALESCE(usu.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu.Apellidos, ''), ' ', 1) ) AS Cliente,
            CONCAT(COALESCE(usu.Nombres, ''), ' ', SUBSTRING_INDEX(COALESCE(usu.Apellidos, ''), ' ', 1)) AS Cliente,

            proye.Direccion AS DireccionProyecto,
            CONCAT(SUBSTRING_INDEX(COALESCE(usu2.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu2.Apellidos, ''), ' ', 1) ) AS UsuarioCreacion,
            CONCAT(DAYNAME(proye.FechaCreacion), ' ', DATE_FORMAT(proye.FechaCreacion, '%d/%m/%Y a las %l:%i:%s %p')) AS FechaCreacion,
            esta.Estado AS EstadoProyecto

        FROM	
            proyectos AS proye
        INNER JOIN	
            usuario AS usu ON proye.DocumentoCliente = usu.DocumentoUsuario
        INNER JOIN
            usuario AS usu2 ON proye.UsuarioCreacion = usu2.DocumentoUsuario
        INNER JOIN
            estado AS esta ON proye.IdEstado = esta.IdEstado
        ORDER BY	
            proye.Nombre ASC
    `;
    return await query(sql);
};
module.exports = {
    ConsultarProyectosQuery
};