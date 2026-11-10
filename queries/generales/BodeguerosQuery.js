const { query } = require('../../config/db');

const ListarBodeguerosQuery = async () => {
    const sql = `
        SELECT
            usu.IdUsuario AS IdBodeguero,
            usu.DocumentoUsuario AS DocumentoBodeguero,
            CONCAT(COALESCE(usu.Nombres, ''), ' ', COALESCE(usu.Apellidos, '')) AS NombreBodeguero
        FROM
            usuario AS usu 
        INNER JOIN	
            usuario_roles AS usurol ON usu.DocumentoUsuario = usurol.DocumentoUsuario
        INNER JOIN
            roles AS rol ON usurol.IdRol = rol.IdRol
        WHERE
            rol.Rol = 'Bodeguero'
            AND usu.IdEstado = ?
        ORDER BY	
	        usu.Nombres ASC, usu.Apellidos ASC
    `;
    const EstadoActivo = 1;
    return query(sql, [EstadoActivo]);
};
module.exports = {
    ListarBodeguerosQuery
};