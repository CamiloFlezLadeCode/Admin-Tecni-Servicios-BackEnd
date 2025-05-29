const { query } = require('../../config/db');

const ListarTransportadoresQuery = async () => {
    const sql = `
        SELECT
            usu.IdUsuario AS IdTransportador,
            usu.DocumentoUsuario AS DocumentoTransportador,
            CONCAT(COALESCE(usu.Nombres, ''), ' ', COALESCE(usu.Apellidos, '')) AS NombreTransportador
        FROM
            usuario AS usu 
        INNER JOIN	
            usuario_roles AS usurol ON usu.DocumentoUsuario = usurol.DocumentoUsuario
        INNER JOIN
            roles AS rol ON usurol.IdRol = rol.IdRol
        WHERE
            rol.Rol = 'Transportador'
        ORDER BY	
	        usu.Nombres ASC, usu.Apellidos ASC
    `;
    return query(sql);
};
module.exports = {
    ListarTransportadoresQuery
};