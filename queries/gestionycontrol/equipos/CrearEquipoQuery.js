const { query } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

const CrearEquipoQuery = async (equipoData) => {
    const sql = `
        INSERT INTO equipo
            (
                Nombre, 
                IdCategoria, 
                PrecioVenta, 
                PrecioAlquiler, 
                PrecioReparacion, 
                UsuarioCreacion,
                FechaCreacion,
                IdEstado,
                Cantidad,
                CantidadDisponible,
                DocumentoSubarrendatario,
                IdTipoEquipo,
                IdUnidadDeMedida,
                IdBodega

            )
            VALUES 
            ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )
    `;
    return query(sql, [
        equipoData.NombreEquipo,
        equipoData.CategoriaEquipo,
        equipoData.PrecioVenta,
        equipoData.PrecioAlquiler,
        equipoData.PrecioReparacion,
        equipoData.UsuarioCreacion,
        FechaActualColombia(),
        equipoData.EstadoEquipo,
        0,
        0,
        equipoData.DocumentoSubarrendatario,
        equipoData.TipoDeEquipo,
        equipoData.UnidadDeMedida,
        equipoData.Bodega
    ]);
};
module.exports = {
    CrearEquipoQuery
};