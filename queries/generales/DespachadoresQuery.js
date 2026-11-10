const { query } = require('../../config/db');

const ListarDespachadoresQuery = async () => {
    const sql = `
        SELECT
            usu.IdUsuario AS IdDespachador,
            usu.DocumentoUsuario AS DocumentoDespachador,
            CONCAT(COALESCE(usu.Nombres, ''), ' ', COALESCE(usu.Apellidos, '')) AS NombreDespachador
        FROM
            usuario AS usu 
        INNER JOIN	
            usuario_roles AS usurol ON usu.DocumentoUsuario = usurol.DocumentoUsuario
        INNER JOIN
            roles AS rol ON usurol.IdRol = rol.IdRol
        WHERE
            rol.Rol = 'Despachador'
            AND usu.IdEstado = ?
        ORDER BY	
	        usu.Nombres ASC, usu.Apellidos ASC
    `;
    const EstadoActivo = 1;
    return query(sql, [EstadoActivo]);
};
module.exports = {
    ListarDespachadoresQuery
};