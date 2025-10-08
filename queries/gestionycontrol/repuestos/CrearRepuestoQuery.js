const { query } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

const CrearRepuestoQuery = async (DatosRepuesto) => {
    const sql = `
        INSERT INTO 
            repuestos 
                (
                    IdBodega,
                    Nombre, 
                    Cantidad, 
                    UsuarioCreacion,
                    FechaCreacion,
                    IdEstado
                ) 
        VALUES 
            ( ?, ?, ?, ?, ?, ? );
    `;
    return query(sql, [
        DatosRepuesto.Bodega,
        DatosRepuesto.NombreRepuesto,
        DatosRepuesto.Cantidad,
        DatosRepuesto.UsuarioCreacion,
        FechaActualColombia(),
        DatosRepuesto.Estado
    ]);
};
module.exports = {
    CrearRepuestoQuery
};