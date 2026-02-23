// const { CrearDevolucionQuery } = require('../../../queries/comercial/devoluciones/CrearDevolucionQuery');

// const CrearDevolucionService = async (datosDevolucion) => {
//     try {
//         if (!datosDevolucion || !datosDevolucion.NoDevolucion || !datosDevolucion.Detalles) {
//             throw new Error('Datos incompletos para crear la devolución');
//         }

//         return await CrearDevolucionQuery(datosDevolucion);
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports = {
//     CrearDevolucionService
// };





// services/comercial/devoluciones/CrearDevolucionService.js
const { pool } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');
const { EmpresaAnfitriona } = require('../../../utils/constant/default');
const DevolucionQuery = require('../../../queries/comercial/devoluciones/CrearDevolucionQuery');

const CrearDevolucionService = async (DatosDevolucion) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        console.log("Datos de devolución:", DatosDevolucion);
        console.log("Detalles recibidos:", DatosDevolucion.Detalles);

        // 1. Insertar devolución principal
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
            DatosDevolucion.FechaDevolucion,
            DatosDevolucion.IncluyeTransporte || false,
            DatosDevolucion.ValorTransporte || 0
        ];

        const IdDevolucion = await DevolucionQuery.insertDevolucion(paramsDevolucion, connection);

        // 2. Procesar detalles
        if (DatosDevolucion.Detalles?.length > 0) {
            for (const detalle of DatosDevolucion.Detalles) {
                // Insertar detalle
                await DevolucionQuery.insertDetalleDevolucion([
                    IdDevolucion,
                    detalle.IdEquipo,
                    detalle.CantidadADevolver,
                    detalle.EstadoEquipo,
                    detalle.IdRemision,
                    detalle.IdDetalleRemision
                ], connection);

                // Lógica de negocio: verificar si es equipo propio
                // const esPropio = detalle.DocumentoSubarrendatario === EmpresaAnfitriona.value;
                const esPropio = detalle.DocumentoSubarrendatario === EmpresaAnfitriona.value;

                if (esPropio) {
                    console.log(`Equipo ${detalle.IdEquipo} es propio, actualizando stock...`);
                    await DevolucionQuery.updateStockEquipo(
                        detalle.IdEquipo,
                        detalle.CantidadADevolver,
                        connection
                    );
                }

                // Registrar movimiento (siempre se registra)
                await DevolucionQuery.insertMovimientoEquipo([
                    detalle.IdEquipo,
                    DatosDevolucion.FechaDevolucion || FechaActualColombia(),
                    2, // Devolución
                    'ENTRADA',
                    Number(detalle.CantidadADevolver),
                    DatosDevolucion.NoDevolucion,
                    IdDevolucion,
                    DatosDevolucion.UsuarioCreacion,
                    FechaActualColombia()
                ], connection);
            }

        }

        await connection.commit();
        return { success: true, IdDevolucion };

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error en CrearDevolucionService:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    CrearDevolucionService
};
