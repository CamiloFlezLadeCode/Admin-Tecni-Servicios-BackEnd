const { query } = require('../../config/db');

const ListarMecanicosQuery = async () => {
    const sql = `
        SELECT
            usu.IdUsuario AS IdMecanico,
            usu.DocumentoUsuario AS DocumentoMecanico,
            CONCAT(COALESCE(usu.Nombres, ''), ' ', COALESCE(usu.Apellidos, '')) AS NombreMecanico
        FROM
            usuario AS usu 
        INNER JOIN	
            usuario_roles AS usurol ON usu.DocumentoUsuario = usurol.DocumentoUsuario
        INNER JOIN
            roles AS rol ON usurol.IdRol = rol.IdRol
        WHERE
            rol.Rol = 'Mecánico'
            AND usu.IdEstado = ?
        ORDER BY	
	        usu.Nombres ASC, usu.Apellidos ASC
    `;
    const EstadoActivo = 1;
    return query(sql, [EstadoActivo]);
};
module.exports = {
    ListarMecanicosQuery
};