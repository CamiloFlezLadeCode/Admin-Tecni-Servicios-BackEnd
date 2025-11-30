const { query } = require('../../../config/db');

const ConsultarUsuarioGeneralPorDocumentoQuery = async (DocumentoUsuarioGeneral) => {
    const sql = `
        SELECT	
            usu.Nombres AS Nombres,
            usu.Apellidos AS Apellidos,
            usu.TipoDocumento AS TipoDocumento,
            usu.DocumentoUsuario AS Documento,
            usu.Direccion AS Direccion,
            usu.Celular1 AS Celular1,
            usu.Celular2 AS Celular2,
            usu.Correo AS Correo,
            usu.IdEstado AS Estado,
            GROUP_CONCAT(rol.IdRol SEPARATOR ', ') AS Roles,
            nivel.IdNivel AS Nivel,
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
        WHERE 
            usu.DocumentoUsuario = ?
        GROUP BY
            usu.DocumentoUsuario
    `;
    return query(sql,[DocumentoUsuarioGeneral]);
};
module.exports = {
    ConsultarUsuarioGeneralPorDocumentoQuery
};