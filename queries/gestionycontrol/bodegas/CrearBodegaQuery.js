const { query } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

const CrearBodegaQuery = async (DatosNuevaBodega) => {
    const sql = `
        INSERT INTO bodegas 
            (
                NombreBodega, 
                Descripcion,
                UsuarioCreacion,
                FechaCreacion, 
                IdTipoBodega, 
                IdEstado
            ) 
        VALUES 
            ( ?, ?, ?, ?, ?, ? );
    `;
    return query(sql, [
        DatosNuevaBodega.NombreDeBodega,
        DatosNuevaBodega.Descripcion,
        DatosNuevaBodega.UsuarioCreacion,
        FechaActualColombia(),
        DatosNuevaBodega.TipoDeBodega,
        DatosNuevaBodega.Estado
    ]);
};
module.exports = {
    CrearBodegaQuery
};