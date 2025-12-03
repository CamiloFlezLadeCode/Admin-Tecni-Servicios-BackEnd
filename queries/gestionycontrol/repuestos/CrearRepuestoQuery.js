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
                    CantidadDisponible, 
                    UsuarioCreacion,
                    FechaCreacion,
                    IdEstado,
                    IdUnidadDeMedida
                ) 
        VALUES 
            ( ?, ?, ?, ?, ?, ?, ?, ? );
    `;
    return query(sql, [
        DatosRepuesto.Bodega,
        DatosRepuesto.NombreRepuesto,
        // DatosRepuesto.Cantidad,
        // DatosRepuesto.Cantidad,
        0,
        0,
        DatosRepuesto.UsuarioCreacion,
        FechaActualColombia(),
        DatosRepuesto.Estado,
        DatosRepuesto.IdUnidadMedida
    ]);
};
module.exports = {
    CrearRepuestoQuery
};