const { query } = require('../../config/db');

const ConsultarCredencialesDelProfesionalQuery = async (DocumentoProfesional) => {
    const sql = `
        SELECT	
            NombreUsuario AS NombreUsuarioProfesional,
            ClaveUsuario AS ClaveUsuarioProfesional         
        FROM
            credenciales
        WHERE
            DocumentoUsuario = ?;   
    `;
    return query(sql, [DocumentoProfesional]);
};
module.exports = {
    ConsultarCredencialesDelProfesionalQuery
};