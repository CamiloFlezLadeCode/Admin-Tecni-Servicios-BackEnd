const { query } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

const CrearProyectoQuery = async (proyectoData) => {
    const sql = `
        INSERT INTO proyectos 
            (
                DocumentoCliente, 
                Nombre, 
                Direccion,
                UsuarioCreacion,
                FechaCreacion,
                IdEstado
            ) 
        VALUES 
            ( ?, ?, ?, ?, ?, ? );
    
    `;
    return await query(sql, [
        proyectoData.DocumentoCliente,
        proyectoData.NombreProyecto,
        proyectoData.DireccionProyecto,
        proyectoData.UsuarioCreacion,
        FechaActualColombia(),
        proyectoData.EstadoProyecto
    ]);
};
module.exports = {
    CrearProyectoQuery
};
