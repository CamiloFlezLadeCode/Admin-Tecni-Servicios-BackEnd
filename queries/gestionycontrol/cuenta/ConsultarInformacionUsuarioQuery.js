const { query } = require('../../../config/db');

const ConsultarInformacionUsuarioQuery = async (DocumentoUsuario) => {
    const sql = `
        SELECT	
            usu.Nombres AS Nombres,
            usu.Apellidos AS Apellidos,
            usu.Correo AS Correo,
            usu.Direccion AS Direccion,
            usu.Telefono AS Telefono,
            usu.Celular1 AS Celular1,
            usu.Celular2 AS Celular2
            #crede.NombreUsuario AS Usuario,
            #crede.ClaveUsuario AS Clave
        FROM
            usuario AS usu
        INNER JOIN
            credenciales AS crede ON usu.DocumentoUsuario = crede.DocumentoUsuario
        WHERE
            usu.DocumentoUsuario =  ?
    `;
    return query(sql, [DocumentoUsuario]);
};
module.exports = {
    ConsultarInformacionUsuarioQuery
};