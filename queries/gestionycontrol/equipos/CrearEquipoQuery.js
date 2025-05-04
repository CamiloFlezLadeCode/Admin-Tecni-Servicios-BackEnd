const { query } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

const CrearEquipoQuery = async (equipoData) => {
    const sql = `
        INSERT INTO equipo
            (
                Nombre, 
                IdRefencia, 
                PrecioVenta, 
                PrecioAlquiler, 
                PrecioReparacion, 
                UsuarioCreacion,
                FechaCreacion,
                IdEstado
            )
            VALUES 
            ( ?, ?, ?, ?, ?, ?, ?, ? )
    `;
    return query(sql, [
        equipoData.NombreEquipo,
        equipoData.ReferenciaEquipo,
        equipoData.PrecioVenta,
        equipoData.PrecioAlquiler,
        equipoData.PrecioReparacion,
        equipoData.UsuarioCreacion,
        FechaActualColombia(),
        equipoData.EstadoEquipo,
    ]);
};
module.exports = {
    CrearEquipoQuery
};