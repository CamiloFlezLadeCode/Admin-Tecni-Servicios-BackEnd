const { query } = require('../../config/db');

const ConsultarProfesionalesPertenecientesQuery = async () => {
    const sql = `
        SELECT	
            CONCAT(COALESCE(profesional.Nombres, ''), ' ', COALESCE(profesional.Apellidos, '')) AS NombreProfesional,
            profesional.DocumentoUsuario AS DocumentoProfesional
            #GROUP_CONCAT(rol.Rol SEPARATOR ', ') AS RolesLabel,
            #GROUP_CONCAT(rol.IdRol SEPARATOR ', ') AS RolesValue
            
        FROM
            usuario AS profesional
        INNER JOIN
            usuario_roles AS usu_rol ON profesional.DocumentoUsuario = usu_rol.DocumentoUsuario
        INNER JOIN
            roles AS rol ON usu_rol.IdRol = rol.IdRol
        WHERE
            rol.Rol IN ('Administrador', 'Bodeguero', 'Conductor', 'Despachador', 'Mecánico', 'Transportador')
        GROUP BY
            profesional.IdUsuario, profesional.Nombres   
        ORDER BY
            NombreProfesional ASC
    `;
    return query(sql);
};
module.exports = {
    ConsultarProfesionalesPertenecientesQuery
};