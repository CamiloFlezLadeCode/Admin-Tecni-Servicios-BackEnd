const { query } = require('../../config/db');

const ConsultarListarClientesQuery = async () => {
    const sql = `
        SELECT
            usu.IdUsuario AS IdCliente,
            usu.DocumentoUsuario AS DocumentoCliente,
            CONCAT(COALESCE(usu.Nombres, ''), ' ', COALESCE(usu.Apellidos, '')) AS NombreCliente
        FROM
            usuario AS usu 
        INNER JOIN	
            usuarioroles AS usurol ON usu.DocumentoUsuario = usurol.DocumentoUsuario
        INNER JOIN
            roles AS rol ON usurol.IdRol = rol.IdRol
        WHERE
            rol.Rol = 'Cliente'
        ORDER BY	
	        usu.Nombres ASC, usu.Apellidos ASC
    `;
    return await query(sql);
};
module.exports = {
    ConsultarListarClientesQuery
};