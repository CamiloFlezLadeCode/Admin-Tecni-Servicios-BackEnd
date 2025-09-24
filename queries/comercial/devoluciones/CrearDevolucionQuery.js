// const { query } = require('../../../config/db');
// const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

// const CrearDevolucionQuery = async (DatosDevolucion) => {
//     try {
//         // Primero insertamos la devolución principal
//         const sqlDevolucion = `
//             INSERT INTO devoluciones (
//                 IdRemision, 
//                 NoDevolucion, 
//                 DocumentoCliente, 
//                 UsuarioCreacion, 
//                 FechaCreacion, 
//                 IdEstado
//             ) VALUES (?, ?, ?, ?, ?, ?)
//         `;

//         const paramsDevolucion = [
//             DatosDevolucion.IdRemision,
//             DatosDevolucion.NoDevolucion,
//             DatosDevolucion.DocumentoCliente,
//             DatosDevolucion.UsuarioCreacion,
//             FechaActualColombia(),
//             DatosDevolucion.IdEstado || 1 // Estado por defecto (1) si no se especifica
//         ];

//         const result = await query(sqlDevolucion, paramsDevolucion);
//         const IdDevolucion = result.insertId;

//         // Luego insertamos los detalles de la devolución
//         if (DatosDevolucion.Detalles && DatosDevolucion.Detalles.length > 0) {
//             for (const detalle of DatosDevolucion.Detalles) {
//                 const sqlDetalle = `
//                     INSERT INTO detalles_devoluciones (
//                         IdDevolucion,
//                         IdEquipo,
//                         Cantidad
//                     ) VALUES (?, ?, ?)
//                 `;

//                 await query(sqlDetalle, [
//                     IdDevolucion,
//                     detalle.IdEquipo,
//                     detalle.CantidadADevolver
//                 ]);
//             }
//         }

//         return { success: true, IdDevolucion };
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports = {
//     CrearDevolucionQuery
// };


const { query, pool } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

const CrearDevolucionQuery = async (DatosDevolucion) => {
    let connection;
    try {
        // Obtenemos una conexión para manejar la transacción
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Insertamos la devolución principal
        const sqlDevolucion = `
            INSERT INTO devoluciones (
                IdRemision, 
                NoDevolucion, 
                DocumentoCliente, 
                UsuarioCreacion, 
                FechaCreacion, 
                IdEstado,
                IdProyecto,
                Observaciones,
                PersonaQueRecibe,
                PersonaQueEntrega,
                FechaDevolucion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const paramsDevolucion = [
            DatosDevolucion.IdRemision,
            DatosDevolucion.NoDevolucion,
            DatosDevolucion.DocumentoCliente,
            DatosDevolucion.UsuarioCreacion,
            FechaActualColombia(),
            DatosDevolucion.IdEstado || 1,
            DatosDevolucion.IdProyecto,
            DatosDevolucion.Observaciones,
            DatosDevolucion.PersonaQueRecibe,
            DatosDevolucion.PersonaQueEntrega,
            DatosDevolucion.FechaDevolucion
        ];

        const result = await connection.query(sqlDevolucion, paramsDevolucion);
        const IdDevolucion = result[0].insertId;

        // 2. Insertamos los detalles y actualizamos el stock
        if (DatosDevolucion.Detalles && DatosDevolucion.Detalles.length > 0) {
            for (const detalle of DatosDevolucion.Detalles) {
                // Insertar detalle de devolución
                const sqlDetalle = `
                    INSERT INTO detalles_devoluciones (
                        IdDevolucion,
                        IdEquipo,
                        Cantidad,
                        IdEstado
                    ) VALUES (?, ?, ?, ?)
                `;
                await connection.query(sqlDetalle, [
                    IdDevolucion,
                    detalle.IdEquipo,
                    detalle.CantidadADevolver,
                    detalle.EstadoEquipo
                ]);

                // Actualizar la cantidad disponible del equipo
                const sqlUpdateStock = `
                    UPDATE equipo 
                    SET CantidadDisponible = CantidadDisponible + ? 
                    WHERE IdEquipo = ?
                `;
                await connection.query(sqlUpdateStock, [
                    detalle.CantidadADevolver,
                    detalle.IdEquipo
                ]);
            }
        }

        // Confirmamos la transacción
        await connection.commit();
        return { success: true, IdDevolucion };

    } catch (error) {
        // Si hay error, hacemos rollback
        if (connection) await connection.rollback();
        throw error;
    } finally {
        // Liberamos la conexión
        if (connection) connection.release();
    }
};

module.exports = {
    CrearDevolucionQuery
};