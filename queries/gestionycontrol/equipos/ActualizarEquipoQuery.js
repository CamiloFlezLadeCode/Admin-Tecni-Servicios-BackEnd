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
    // Primero obtenemos los valores actuales
    const sqlSelect = `SELECT Cantidad, CantidadDisponible FROM equipo WHERE IdEquipo = ?`;
    const [equipoActual] = await query(sqlSelect, [DatosEquipoAActualizar.IdEquipo]);

    const cantidadActual = equipoActual.Cantidad;
    const cantidadDisponibleActual = equipoActual.CantidadDisponible;
    const cantidadNueva = DatosEquipoAActualizar.Cantidad;

    // Calculamos la diferencia
    const diferencia = cantidadNueva - cantidadActual;

    // Calculamos la nueva CantidadDisponible
    let nuevaCantidadDisponible = cantidadDisponibleActual + diferencia;

    // Aseguramos que CantidadDisponible no sea negativa
    if (nuevaCantidadDisponible < 0) {
        nuevaCantidadDisponible = 0;
    }

    // Ahora actualizamos ambos campos
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
            Cantidad = ?,
            CantidadDisponible = ?,
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
        cantidadNueva,
        nuevaCantidadDisponible,
        DatosEquipoAActualizar.EstadoEquipo,
        DatosEquipoAActualizar.IdEquipo
    ]);
};

module.exports = {
    ActualizarEquipoQuery
};