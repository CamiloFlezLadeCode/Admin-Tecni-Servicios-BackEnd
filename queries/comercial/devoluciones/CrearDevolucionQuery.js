// const { pool } = require('../../../config/db');
// const { FechaActualColombia } = require('../../../utils/FechaActualColombia');
// const { EmpresaAnfitriona } = require('../../../utils/constant/default');

// const CrearDevolucionQuery = async (DatosDevolucion) => {
//     let connection;
//     try {
//         connection = await pool.getConnection();
//         await connection.beginTransaction();
//         console.log("Detalles recibidos:", DatosDevolucion.Detalles);

//         // 1. Insertamos la devolución principal
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
//                 FechaDevolucion,
//                 IncluyeTransporte,
//                 ValorTransporte
//             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
//             DatosDevolucion.FechaDevolucion,
//             DatosDevolucion.IncluyeTransporte || false,
//             DatosDevolucion.ValorTransporte || 0
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
//                     detalle.IdRemision // ✅ Esta es la fuente de verdad
//                 ]);

//                 // Actualizar inventario SOLO si el equipo es propio
//                 // const [prop] = await connection.query(
//                 //     `SELECT DocumentoSubarrendatario AS Propietario FROM equipo WHERE IdEquipo = ?`,
//                 //     [detalle.IdEquipo]
//                 // );
//                 // const propietario = prop.length > 0 ? prop[0].Propietario : null;
//                 // const esPropio = propietario === EmpresaAnfitriona.value;

//                 // Actualizar si el subarrendatario es la empresa anfitriona                

//                 if (DatosDevolucion.DocumentoSubarrendatario === EmpresaAnfitriona.value) {
//                     const sqlUpdateStock = `
//                         UPDATE equipo 
//                         SET CantidadDisponible = CantidadDisponible + ?, IdEstado = 3
//                         WHERE IdEquipo = ?
//                     `;
//                     await connection.query(sqlUpdateStock, [
//                         detalle.CantidadADevolver,
//                         detalle.IdEquipo
//                     ]);
//                 } else {
//                     console.log(`[Devolucion] No se actualiza stock para equipo ${detalle.IdEquipo} porque es de un tercero.`);
//                 }
//                 // Registrar movimiento de equipo (histórico)
//                 const InsertarMovimiento = `
//                     INSERT INTO movimiento_equipo (
//                         IdEquipo, Fecha, IdTipoMovimiento, Direccion, Cantidad,
//                         DocumentoReferencia, IdDocumentoOrigen, UsuarioCreacion, FechaRegistro
//                     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//                 `;
//                 await connection.query(InsertarMovimiento, [
//                     detalle.IdEquipo,
//                     DatosDevolucion.FechaDevolucion || FechaActualColombia(),
//                     2, // Devolución
//                     'ENTRADA',
//                     Number(detalle.CantidadADevolver),
//                     DatosDevolucion.NoDevolucion,
//                     IdDevolucion,
//                     DatosDevolucion.UsuarioCreacion,
//                     FechaActualColombia()
//                 ]);
//             }
//         }

//         await connection.commit();
//         return { success: true, IdDevolucion };

//     } catch (error) {
//         if (connection) await connection.rollback();
//         console.error('Error en CrearDevolucionQuery:', error);
//         throw error;
//     } finally {
//         if (connection) connection.release();
//     }
// };

// module.exports = {
//     CrearDevolucionQuery
// };



// queries/comercial/devoluciones/CrearDevolucionQuery.js
const { pool } = require('../../../config/db');

const CrearDevolucionQuery = {
    // Todas reciben la conexión de la transacción del servicio (CrearDevolucionService).
    // Antes la ignoraban y ejecutaban con `pool`: cada sentencia se confirmaba sola y el
    // rollback no deshacía nada, así que un error a mitad dejaba la devolución a medias.
    async insertDevolucion(datos, connection) {
        const sql = `
            INSERT INTO devoluciones ( 
                NoDevolucion, DocumentoCliente, UsuarioCreacion, 
                FechaCreacion, IdEstado, IdProyecto, Observaciones,
                PersonaQueRecibe, PersonaQueEntrega, FechaDevolucion,
                IncluyeTransporte, ValorTransporte
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await (connection || pool).query(sql, datos);
        return result.insertId;
    },

    async insertDetalleDevolucion(detalle, connection) {
        const sql = `
            INSERT INTO detalles_devoluciones (
                IdDevolucion, IdEquipo, Cantidad, IdEstado, IdRemision, IdDetalleRemision
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;
        return (connection || pool).query(sql, detalle);
    },

    async updateStockEquipo(IdEquipo, cantidad, connection) {
        const sql = `
            UPDATE equipo 
            SET CantidadDisponible = CantidadDisponible + ?, IdEstado = 3
            WHERE IdEquipo = ?
        `;
        return (connection || pool).query(sql, [cantidad, IdEquipo]);
    },

    async getPropietarioEquipo(IdEquipo) {
        const sql = `
            SELECT DocumentoSubarrendatario AS Propietario 
            FROM equipo WHERE IdEquipo = ?
        `;
        const [rows] = await pool.query(sql, [IdEquipo]);
        return rows[0]?.Propietario;
    },

    async insertMovimientoEquipo(movimiento, connection) {
        const sql = `
            INSERT INTO movimiento_equipo (
                IdEquipo, Fecha, IdTipoMovimiento, Direccion, Cantidad,
                DocumentoReferencia, IdDocumentoOrigen, UsuarioCreacion, FechaRegistro
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        return (connection || pool).query(sql, movimiento);
    },
};

module.exports = CrearDevolucionQuery;