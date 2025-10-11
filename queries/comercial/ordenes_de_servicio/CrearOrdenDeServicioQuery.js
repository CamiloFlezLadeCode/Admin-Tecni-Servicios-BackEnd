// const { query, pool } = require('../../../config/db');
// const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

// const CrearOrdenDeServicioQuery = async (DatosOrdenDeServicio) => {
//     const sql = `
//         INSERT INTO 
//             ordenes_de_servicio 
//                 (
//                     NoOrdenDeServicio, 
//                     DocumentoCliente, 
//                     IdProyecto, 
//                     Garantia, 
//                     Descripcion, 
//                     Observaciones, 
//                     DocumentoMecanico, 
//                     PersonaQueEntrega, 
//                     PersonaQueRecibe, 
//                     UsuarioCreacion, 
//                     FechaCreacion, 
//                     IdEstado
//                 ) 
//         VALUES 
//             ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );
//     `;
//     return query(sql, [
//         DatosOrdenDeServicio.NoOrdenDeServicio,
//         DatosOrdenDeServicio.DocumentoCliente,
//         DatosOrdenDeServicio.IdProyecto,
//         DatosOrdenDeServicio.Garantia,
//         DatosOrdenDeServicio.Descripcion,
//         DatosOrdenDeServicio.Observaciones,
//         DatosOrdenDeServicio.DocumentoMecanico,
//         DatosOrdenDeServicio.PersonaQueEntrega,
//         DatosOrdenDeServicio.PersonaQueRecibe,
//         DatosOrdenDeServicio.UsuarioCreacion,
//         FechaActualColombia(),
//         DatosOrdenDeServicio.IdEstado
//     ]);
// };
// module.exports = {
//     CrearOrdenDeServicioQuery
// };





// // CASIII CASIII

// const { query, pool } = require('../../../config/db');
// const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

// const CrearOrdenDeServicioQuery = async (DatosOrdenDeServicio) => {
//     const connection = await pool.getConnection();
//     try {
//         await connection.beginTransaction();
//         // Se realiza inserción en la tabla principal [ordenes_de_servicio]
//         const InsertarOrdenDeServicio = `
//             INSERT INTO 
//                 ordenes_de_servicio 
//                     (
//                         NoOrdenDeServicio, 
//                         DocumentoCliente, 
//                         IdProyecto, 
//                         Garantia, 
//                         Descripcion, 
//                         Observaciones, 
//                         DocumentoMecanico, 
//                         PersonaQueEntrega, 
//                         PersonaQueRecibe, 
//                         UsuarioCreacion, 
//                         FechaCreacion, 
//                         IdEstado,
//                         FechaOrdenDeServicio
//                     ) 
//             VALUES 
//                 ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );
//         `;
//         const [ResultadoOrdenDeServicio] = await connection.query(InsertarOrdenDeServicio, [
//             DatosOrdenDeServicio.NoOrdenDeServicio,
//             DatosOrdenDeServicio.DocumentoCliente,
//             DatosOrdenDeServicio.IdProyecto,
//             DatosOrdenDeServicio.Garantia,
//             DatosOrdenDeServicio.Descripcion,
//             DatosOrdenDeServicio.Observaciones,
//             DatosOrdenDeServicio.DocumentoMecanico,
//             DatosOrdenDeServicio.PersonaQueEntrega,
//             DatosOrdenDeServicio.PersonaQueRecibe,
//             DatosOrdenDeServicio.UsuarioCreacion,
//             FechaActualColombia(),
//             DatosOrdenDeServicio.IdEstado,
//             DatosOrdenDeServicio.FechaOrdenDeServicio
//         ]);
//         // ...

//         // Se captura el id de la orden de servicio creada
//         const IdOrdenDeServicio = ResultadoOrdenDeServicio.insertId;
//         if (!IdOrdenDeServicio) throw new Error('No se pudo obtener el ID de la orden de servicio.');
//         // ...

//         // Se inserta información en tabla secundaria [detalles_orden_de_servivio]
//         const InsertarDetallesOrdenDeServicio = `
//             INSERT INTO 
//                 detalles_ordenes_de_servicio 
//                     (
//                         IdOrdenDeServicio, 
//                         Cantidad, 
//                         DescripcionEquipo
//                     ) 
//             VALUES 
//                 ( ?, ?, ? );
//         `;
//         for (const detalle of DatosOrdenDeServicio.Detalles) {
//             await connection.query(InsertarDetallesOrdenDeServicio, [
//                 IdOrdenDeServicio,
//                 detalle.Cantidad,
//                 detalle.DescripcionEquipo
//             ]);
//         };
//         // ...

//         // Se confirman todos los cambios
//         await connection.commit();
//         // ...

//         // Se retorna resultado exitoso
//         return { success: true, IdOrdenDeServicio };
//         // ...
//     } catch (error) {
//         await connection.rollback();
//         console.error('Error al crear la orden de servicio: ', error);
//         throw new Error('Error al crear la orden de servicio');
//     } finally {
//         connection.release(); //Liberar conexión
//     }
// };

// module.exports = {
//     CrearOrdenDeServicioQuery
// };




const { query, pool } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

const CrearOrdenDeServicioQuery = async (DatosOrdenDeServicio) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Validación básica de datos requeridos
        if (!DatosOrdenDeServicio.NoOrdenDeServicio || !DatosOrdenDeServicio.DocumentoCliente) {
            throw new Error('Datos básicos de la orden son requeridos');
        }

        // Se realiza inserción en la tabla principal [ordenes_de_servicio]
        const InsertarOrdenDeServicio = `
            INSERT INTO 
                ordenes_de_servicio 
                    (
                        NoOrdenDeServicio, 
                        DocumentoCliente, 
                        IdProyecto, 
                        Garantia, 
                        Descripcion, 
                        Observaciones, 
                        DocumentoMecanico, 
                        PersonaQueEntrega, 
                        PersonaQueRecibe, 
                        UsuarioCreacion, 
                        FechaCreacion, 
                        IdEstado,
                        FechaOrdenDeServicio,
                        IdEquipoCliente
                    ) 
            VALUES 
                ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );
        `;

        const [ResultadoOrdenDeServicio] = await connection.query(InsertarOrdenDeServicio, [
            DatosOrdenDeServicio.NoOrdenDeServicio,
            DatosOrdenDeServicio.DocumentoCliente,
            DatosOrdenDeServicio.IdProyecto || null,
            DatosOrdenDeServicio.Garantia || 0,
            DatosOrdenDeServicio.Descripcion || '',
            DatosOrdenDeServicio.Observaciones || '',
            DatosOrdenDeServicio.DocumentoMecanico,
            DatosOrdenDeServicio.PersonaQueEntrega,
            DatosOrdenDeServicio.PersonaQueRecibe,
            DatosOrdenDeServicio.UsuarioCreacion,
            FechaActualColombia(),
            DatosOrdenDeServicio.IdEstado || 8, // Estado por defecto
            DatosOrdenDeServicio.FechaOrdenDeServicio,
            DatosOrdenDeServicio.IdEquipoCliente || null
        ]);

        // Se captura el id de la orden de servicio creada
        const IdOrdenDeServicio = ResultadoOrdenDeServicio.insertId;
        if (!IdOrdenDeServicio) {
            throw new Error('No se pudo obtener el ID de la orden de servicio.');
        }

        // Se inserta información en tabla secundaria [detalles_ordenes_de_servicio] SOLO si hay detalles
        if (DatosOrdenDeServicio.Detalles && DatosOrdenDeServicio.Detalles.length > 0) {
            const InsertarDetallesOrdenDeServicio = `
                INSERT INTO 
                    detalles_ordenes_de_servicio 
                        (
                            IdOrdenDeServicio, 
                            Cantidad, 
                            DescripcionEquipo,
                            IdRepuesto
                        ) 
                VALUES 
                    ( ?, ?, ?, ? );
            `;

            for (const detalle of DatosOrdenDeServicio.Detalles) {
                // Validar que el detalle tenga los datos mínimos requeridos
                if (detalle.Cantidad && detalle.IdRepuesto) {
                    await connection.query(InsertarDetallesOrdenDeServicio, [
                        IdOrdenDeServicio,
                        detalle.Cantidad,
                        detalle.DescripcionEquipo || '', // Descripción opcional
                        detalle.IdRepuesto
                    ]);
                }
            }
        }

        // Actualizar stock en bodega si hay repuestos utilizados
        if (DatosOrdenDeServicio.Detalles && DatosOrdenDeServicio.Detalles.length > 0) {
            // await actualizarStockRepuestos(connection, DatosOrdenDeServicio.Detalles);
            actualizarStockDeRepuesto(connection, DatosOrdenDeServicio.Detalles);
        }

        // Se confirman todos los cambios
        await connection.commit();

        // Se retorna resultado exitoso
        return {
            success: true,
            IdOrdenDeServicio,
            NoOrdenDeServicio: DatosOrdenDeServicio.NoOrdenDeServicio,
            message: 'Orden de servicio creada correctamente'
        };

    } catch (error) {
        await connection.rollback();
        console.error('Error al crear la orden de servicio: ', error);
        throw new Error(`Error al crear la orden de servicio: ${error.message}`);
    } finally {
        connection.release(); // Liberar conexión
    }
};

// Función para actualizar el stock de repuestos
const actualizarStockRepuestos = async (connection, detalles) => {
    try {
        for (const detalle of detalles) {
            if (detalle.IdRepuesto && detalle.Cantidad) {
                const actualizarStock = `
                    UPDATE inventario_bodegas 
                    SET CantidadDisponible = CantidadDisponible - ? 
                    WHERE IdRepuesto = ? 
                    AND IdTipoBodega = ? 
                    AND CantidadDisponible >= ?;
                `;

                const [result] = await connection.query(actualizarStock, [
                    detalle.Cantidad,
                    detalle.IdRepuesto,
                    ParametroBuscarBodegasRepuestos.value, // Asegúrate de definir esta constante
                    detalle.Cantidad
                ]);

                if (result.affectedRows === 0) {
                    throw new Error(`Stock insuficiente para el repuesto ID: ${detalle.IdRepuesto}`);
                }

                // Registrar movimiento de inventario
                const registrarMovimiento = `
                    INSERT INTO movimientos_inventario 
                    (IdRepuesto, IdTipoBodega, TipoMovimiento, Cantidad, Descripcion, Usuario, FechaMovimiento)
                    VALUES (?, ?, 'SALIDA', ?, 'Orden de servicio', ?, NOW());
                `;

                await connection.query(registrarMovimiento, [
                    detalle.IdRepuesto,
                    ParametroBuscarBodegasRepuestos.value,
                    detalle.Cantidad,
                    'Sistema' // O el usuario que crea la orden
                ]);
            }
        }
    } catch (error) {
        throw new Error(`Error al actualizar stock: ${error.message}`);
    }
};

const actualizarStockDeRepuesto = async (connection, detalles) => {
    try {
        for (const detalle of detalles) {
            if (detalle.IdRepuesto && detalle.Cantidad) {
                const actualizarStock = `
                    UPDATE repuestos
                    SET Cantidad = (Cantidad - ?)
                    WHERE IdRepuesto = ?
                `;
                const [result] = await connection.query(actualizarStock, [
                    detalle.Cantidad,
                    detalle.IdRepuesto,
                ]);

                if (result.affectedRows === 0) {
                    throw new Error(`Stock insuficiente para el repuesto ID: ${detalle.IdRepuesto}`);
                }
            }
        }
    } catch (error) {
        throw new Error(`Error al actualizar stock: ${error.message}`);
    }
};

// Opcional: Función para verificar disponibilidad antes de crear la orden
const verificarDisponibilidadRepuestos = async (detalles) => {
    const connection = await pool.getConnection();
    try {
        for (const detalle of detalles) {
            if (detalle.IdRepuesto && detalle.Cantidad) {
                const verificarStock = `
                    SELECT CantidadDisponible 
                    FROM inventario_bodegas 
                    WHERE IdRepuesto = ? 
                    AND IdTipoBodega = ?;
                `;

                const [stock] = await connection.query(verificarStock, [
                    detalle.IdRepuesto,
                    ParametroBuscarBodegasRepuestos.value
                ]);

                if (stock.length === 0 || stock[0].CantidadDisponible < detalle.Cantidad) {
                    throw new Error(`Stock insuficiente para el repuesto ID: ${detalle.IdRepuesto}. Disponible: ${stock[0]?.CantidadDisponible || 0}, Solicitado: ${detalle.Cantidad}`);
                }
            }
        }
    } finally {
        connection.release();
    }
};

module.exports = {
    CrearOrdenDeServicioQuery,
    verificarDisponibilidadRepuestos // Opcional: para usar antes de crear la orden
};