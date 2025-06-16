const { query } = require('../../config/db');
const { FechaActualColombia } = require('../../utils/FechaActualColombia');

const CrearCredencialesProfesionalQuery = async (DatosCredenciales) => {
    const sql = `
        INSERT INTO 
            credenciales 
                (
                    DocumentoUsuario, 
                    NombreUsuario, 
                    ClaveUsuario, 
                    UsuarioCreacion, 
                    FechaCreacion
                ) 
        VALUES 
            ( ?, ?, ?, ?, ? );
    `;
    return query(sql, [
        DatosCredenciales.DocumentoProfesional,
        DatosCredenciales.User,
        DatosCredenciales.Password,
        DatosCredenciales.DocumentoUsuario,
        FechaActualColombia()
    ]);
};
module.exports = {
    CrearCredencialesProfesionalQuery
};