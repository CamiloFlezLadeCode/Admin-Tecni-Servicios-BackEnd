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
        ORDER BY	
	        usu.Nombres ASC, usu.Apellidos ASC
    `;
    return query(sql);
};
module.exports = {
    ListarMecanicosQuery
};