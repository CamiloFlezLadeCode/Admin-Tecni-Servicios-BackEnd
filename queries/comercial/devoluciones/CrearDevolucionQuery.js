// const { query, pool } = require('../../../config/db');
// const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

// const CrearDevolucionQuery = async (DatosDevolucion) => {
//     let connection;
//     try {
//         // Obtenemos una conexión para manejar la transacción
//         connection = await pool.getConnection();
//         await connection.beginTransaction();
//         console.log(DatosDevolucion.Detalles)
//         // 1. Insertamos la devolución principal
//         const sqlDevolucion = `
//             INSERT INTO devoluciones (
//                 IdRemision, 
//                 NoDevolucion, 
//                 DocumentoCliente, 
//                 UsuarioCreacion, 
//                 FechaCreacion, 
//                 IdEstado,
//                 IdProyecto,
//                 Observaciones,
//                 PersonaQueRecibe,
//                 PersonaQueEntrega,
//                 FechaDevolucion
//             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;

//         const paramsDevolucion = [
//             // DatosDevolucion.IdRemision,
//             DatosDevolucion.Detalles.IdRemision,
//             DatosDevolucion.NoDevolucion,
//             DatosDevolucion.DocumentoCliente,
//             DatosDevolucion.UsuarioCreacion,
//             FechaActualColombia(),
//             DatosDevolucion.IdEstado || 1,
//             DatosDevolucion.IdProyecto,
//             DatosDevolucion.Observaciones,
//             DatosDevolucion.PersonaQueRecibe,
//             DatosDevolucion.PersonaQueEntrega,
//             DatosDevolucion.FechaDevolucion
//         ];

//         const result = await connection.query(sqlDevolucion, paramsDevolucion);
//         const IdDevolucion = result[0].insertId;

//         // 2. Insertamos los detalles y actualizamos el stock
//         if (DatosDevolucion.Detalles && DatosDevolucion.Detalles.length > 0) {
//             for (const detalle of DatosDevolucion.Detalles) {
//                 // Insertar detalle de devolución
//                 const sqlDetalle = `
//                     INSERT INTO detalles_devoluciones (
//                         IdDevolucion,
//                         IdEquipo,
//                         Cantidad,
//                         IdEstado
//                     ) VALUES (?, ?, ?, ?)
//                 `;
//                 await connection.query(sqlDetalle, [
//                     IdDevolucion,
//                     detalle.IdEquipo,
//                     detalle.CantidadADevolver,
//                     detalle.EstadoEquipo
//                 ]);

//                 // Actualizar la cantidad disponible del equipo
//                 const sqlUpdateStock = `
//                     UPDATE equipo 
//                     SET CantidadDisponible = CantidadDisponible + ? 
//                     WHERE IdEquipo = ?
//                 `;
//                 await connection.query(sqlUpdateStock, [
//                     detalle.CantidadADevolver,
//                     detalle.IdEquipo
//                 ]);
//             }
//         }

//         // Confirmamos la transacción
//         await connection.commit();
//         return { success: true, IdDevolucion };

//     } catch (error) {
//         // Si hay error, hacemos rollback
//         if (connection) await connection.rollback();
//         throw error;
//     } finally {
//         // Liberamos la conexión
//         if (connection) connection.release();
//     }
// };

// module.exports = {
//     CrearDevolucionQuery
// };








/**
 * PRUEBASSSS
 * 
 */
// const { query, pool } = require('../../../config/db');
// const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

// const CrearDevolucionQuery = async (DatosDevolucion) => {
//     let connection;
//     try {
//         // Obtenemos una conexión para manejar la transacción
//         connection = await pool.getConnection();
//         await connection.beginTransaction();
//         console.log("Detalles recibidos:", DatosDevolucion.Detalles);

//         // 1. Insertamos la devolución principal (con IdRemision como null)
//         const sqlDevolucion = `
//             INSERT INTO devoluciones ( 
//                 NoDevolucion, 
//                 DocumentoCliente, 
//                 UsuarioCreacion, 
//                 FechaCreacion, 
//                 IdEstado,
//                 IdProyecto,
//                 Observaciones,
//                 PersonaQueRecibe,
//                 PersonaQueEntrega,
//                 FechaDevolucion
//             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;

//         const paramsDevolucion = [
//             DatosDevolucion.NoDevolucion,
//             DatosDevolucion.DocumentoCliente,
//             DatosDevolucion.UsuarioCreacion,
//             FechaActualColombia(),
//             DatosDevolucion.IdEstado || 1,
//             DatosDevolucion.IdProyecto,
//             DatosDevolucion.Observaciones,
//             DatosDevolucion.PersonaQueRecibe,
//             DatosDevolucion.PersonaQueEntrega,
//             DatosDevolucion.FechaDevolucion
//         ];

//         const result = await connection.query(sqlDevolucion, paramsDevolucion);
//         const IdDevolucion = result[0].insertId;

//         // 2. Insertamos los detalles y actualizamos el stock
//         if (DatosDevolucion.Detalles && DatosDevolucion.Detalles.length > 0) {
//             for (const detalle of DatosDevolucion.Detalles) {
//                 // Insertar detalle de devolución CON IdRemision
//                 const sqlDetalle = `
//                     INSERT INTO detalles_devoluciones (
//                         IdDevolucion,
//                         IdEquipo,
//                         Cantidad,
//                         IdEstado,
//                         IdRemision
//                     ) VALUES (?, ?, ?, ?, ?)
//                 `;
//                 await connection.query(sqlDetalle, [
//                     IdDevolucion,
//                     detalle.IdEquipo,
//                     detalle.CantidadADevolver,
//                     detalle.EstadoEquipo,
//                     detalle.IdRemision // Guardar la remisión específica de cada equipo
//                 ]);

//                 // Actualizar la cantidad disponible del equipo
//                 const sqlUpdateStock = `
//                     UPDATE equipo 
//                     SET CantidadDisponible = CantidadDisponible + ? 
//                     WHERE IdEquipo = ?
//                 `;
//                 await connection.query(sqlUpdateStock, [
//                     detalle.CantidadADevolver,
//                     detalle.IdEquipo
//                 ]);

//                 // Actualizar remisiones_detalles para llevar control de lo devuelto
//                 if (detalle.IdRemision) {
//                     const sqlUpdateRemisionDetalle = `
//                         UPDATE detalles_remisiones
//                         SET CantidadDevuelta = COALESCE(CantidadDevuelta, 0) + ?,
//                             FechaDevolucion = ?
//                         WHERE IdRemision = ? AND IdEquipo = ?
//                     `;
//                     try {
//                         await connection.query(sqlUpdateRemisionDetalle, [
//                             detalle.CantidadADevolver,
//                             FechaActualColombia(),
//                             detalle.IdRemision,
//                             detalle.IdEquipo
//                         ]);
//                     } catch (error) {
//                         console.log('No se pudo actualizar remisiones_detalles:', error.message);
//                         // Continuar sin error si la tabla no existe o hay otro problema
//                     }
//                 }
//             }
//         }

//         // Confirmamos la transacción
//         await connection.commit();
//         return { success: true, IdDevolucion };

//     } catch (error) {
//         // Si hay error, hacemos rollback
//         if (connection) await connection.rollback();
//         console.error('Error en CrearDevolucionQuery:', error);
//         throw error;
//     } finally {
//         // Liberamos la conexión
//         if (connection) connection.release();
//     }
// };

// module.exports = {
//     CrearDevolucionQuery
// };















const { query, pool } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');
const { EmpresaAnfitriona } = require('../../../utils/constant/default');

const CrearDevolucionQuery = async (DatosDevolucion) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        console.log("Detalles recibidos:", DatosDevolucion.Detalles);

        // 1. Insertamos la devolución principal
        const sqlDevolucion = `
            INSERT INTO devoluciones ( 
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
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const paramsDevolucion = [
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
                // Insertar detalle de devolución CON IdRemision
                const sqlDetalle = `
                    INSERT INTO detalles_devoluciones (
                        IdDevolucion,
                        IdEquipo,
                        Cantidad,
                        IdEstado,
                        IdRemision
                    ) VALUES (?, ?, ?, ?, ?)
                `;
                await connection.query(sqlDetalle, [
                    IdDevolucion,
                    detalle.IdEquipo,
                    detalle.CantidadADevolver,
                    detalle.EstadoEquipo,
                    detalle.IdRemision // ✅ Esta es la fuente de verdad
                ]);

                // Actualizar la cantidad disponible del equipo
                if (DatosDevolucion.DocumentoSubarrendatario === EmpresaAnfitriona.value) {
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

                // ❌ ELIMINADO: No necesitas actualizar detalles_remisiones
                // La información ya está en detalles_devoluciones
            }
        }

        await connection.commit();
        return { success: true, IdDevolucion };

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error en CrearDevolucionQuery:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    CrearDevolucionQuery
};