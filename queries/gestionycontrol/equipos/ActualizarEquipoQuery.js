// const { query } = require('../../../config/db');

// const ActualizarEquipoQuery = async (DatosEquipoAActualizar) => {
//     const sql = `
//         UPDATE 
//             equipo 
//         SET 
//             Nombre = ?, 
//             IdCategoria = ?, 
//             DocumentoSubarrendatario = ?, 
//             PrecioVenta = ?, 
//             PrecioAlquiler = ?, 
//             PrecioReparacion = ?, 
//             Cantidad = ?, 
//             IdEstado = ?
//         WHERE 
//             equipo.IdEquipo = ?;
//     `;
//     return query(sql, [
//         DatosEquipoAActualizar.NombreEquipo,
//         DatosEquipoAActualizar.CategoriaEquipo,
//         DatosEquipoAActualizar.DocumentoSubarrendatario,
//         DatosEquipoAActualizar.PrecioVenta,
//         DatosEquipoAActualizar.PrecioAlquiler,
//         DatosEquipoAActualizar.PrecioReparacion,
//         DatosEquipoAActualizar.Cantidad,
//         DatosEquipoAActualizar.EstadoEquipo,
//         DatosEquipoAActualizar.IdEquipo
//     ]);
// };
// module.exports = {
//     ActualizarEquipoQuery
// };

const { query } = require('../../../config/db');

const ActualizarEquipoQuery = async (DatosEquipoAActualizar) => {
    // La cantidad ya no se actualiza desde aquí, se maneja por inventario
    const sqlUpdate = `
        UPDATE 
            equipo 
        SET 
            Nombre = ?, 
            IdCategoria = ?, 
            DocumentoSubarrendatario = ?, 
            PrecioVenta = ?, 
            PrecioAlquiler = ?, 
            PrecioReparacion = ?, 
            IdEstado = ?
        WHERE 
            IdEquipo = ?;
    `;

    return query(sqlUpdate, [
        DatosEquipoAActualizar.NombreEquipo,
        DatosEquipoAActualizar.CategoriaEquipo,
        DatosEquipoAActualizar.DocumentoSubarrendatario,
        DatosEquipoAActualizar.PrecioVenta,
        DatosEquipoAActualizar.PrecioAlquiler,
        DatosEquipoAActualizar.PrecioReparacion,
        DatosEquipoAActualizar.EstadoEquipo,
        DatosEquipoAActualizar.IdEquipo
    ]);
};

module.exports = {
    ActualizarEquipoQuery
};