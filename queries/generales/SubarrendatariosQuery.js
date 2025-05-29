const { query } = require('../../config/db');

const ConsultarSubarrendatariosQuery = async () => {
    const sql = `
        SELECT
            usu.IdUsuario AS IdSubarrendatario,
            usu.DocumentoUsuario AS DocumentoSubarrendatario,
            CONCAT(COALESCE(usu.Nombres, ''), ' ', COALESCE(usu.Apellidos, '')) AS NombreSubarrendatario
        FROM
            usuario AS usu 
        INNER JOIN	
            usuario_roles AS usurol ON usu.DocumentoUsuario = usurol.DocumentoUsuario
        INNER JOIN
            roles AS rol ON usurol.IdRol = rol.IdRol
        WHERE
            rol.Rol = 'Subarrendatario'
        ORDER BY	
	        usu.Nombres ASC, usu.Apellidos ASC
    `;
    return query(sql);
};
module.exports = {
    ConsultarSubarrendatariosQuery
};