// const { query, pool } = require('../../../config/db');
// const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

// const CrearRemisionQuery = async (DatosRemision) => {
//     const connection = await pool.getConnection();
//     try {
//         await connection.beginTransaction();
//         //Se inserta información en tabla principal remisiones
//         const InsertarRemision = `
//             INSERT INTO
//                 remisiones
//                 (
//                     NoRemision, 
//                     DocumentoCliente,
//                     IdProyecto, 
//                     PrecioTotalGeneralSinIVA, 
//                     IVA, 
//                     PrecioTotalGeneralConIVA, 
//                     IdBodega, 
//                     DocumentoBodeguero, 
//                     DocumentoDespachador, 
//                     DocumentoTransportador, 
//                     IdVehiculo, 
//                     PlacaVehiculoRecibe, 
//                     NombrePersonaRecibe, 
//                     ObservacionesEmpresa, 
//                     UsuarioCreacion, 
//                     FechaCreacion, 
//                     IdEstado
//                 ) 
//             VALUES
//                 ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );
//         `;
//         const [ResultadoRemision] = await connection.query(InsertarRemision, [
//             DatosRemision.NoRemision,
//             DatosRemision.DocumentoCliente,
//             DatosRemision.IdProyecto,
//             DatosRemision.PrecioTotalGeneralSinIVA,
//             DatosRemision.IVA,
//             DatosRemision.PrecioTotalGeneralConIVA,
//             DatosRemision.IdBodega,
//             DatosRemision.DocumentoBodeguero,
//             DatosRemision.DocumentoDespachador,
//             DatosRemision.DocumentoTransportador,
//             DatosRemision.IdVehiculo,
//             DatosRemision.PlacaVehiculoRecibe,
//             DatosRemision.NombrePersonaRecibe,
//             DatosRemision.ObservacionesEmpresa,
//             DatosRemision.UsuarioCreacion,
//             FechaActualColombia(),
//             DatosRemision.IdEstado
//         ]);
//         //...

//         //Se captura el id de la remisión insertada previamente
//         const IdRemision = ResultadoRemision.insertId;
//         if (!IdRemision) throw new Error('No se pudo obtener el ID de la remisión.');
//         //...

//         //Se inserta información en la tabla secundaria detalles_remisiones
//         const InsertarDetallesRemision = `
//             INSERT INTO 
//                 detalles_remisiones 
//                 (
//                     IdRemision, 
//                     DocumentoSubarrendatario, 
//                     IdCategoria, 
//                     IdEquipo, 
//                     Cantidad, 
//                     PrecioUnidad, 
//                     PrecioTotal, 
//                     ObservacionesCliente
//                 ) 
//             VALUES 
//                 ( ?, ?, ?, ?, ?, ?, ?, ? );
//         `;
//         for (const detalle of DatosRemision.Detalles) {
//             await connection.query(InsertarDetallesRemision, [
//                 IdRemision,
//                 detalle.DocumentoSubarrendatario,
//                 detalle.IdCategoria,
//                 detalle.IdEquipo,
//                 detalle.Cantidad,
//                 detalle.PrecioUnidad,
//                 detalle.PrecioTotal,
//                 detalle.ObservacionesCliente
//             ]);
//         };
//         //...

//         //Se cambia el estado del equipo y se reduce la cantidad del equipo ó material
//         const CapturarCantidad = `
//             SELECT
//                 CantidadDisponible
//             FROM
//                 equipo
//             WHERE
//                 IdEquipo = ?;
//         `;
//         const ReducirCantidadEquipo = `
//             UPDATE 
//                 equipo 
//             SET 
//                 CantidadDisponible = ?
//             WHERE 
//                 equipo.IdEquipo = ?;
//         `;
//         const CambiarEstadoEquipo = `
//             UPDATE 
//                 equipo 
//             SET 
//                 IdEstado = 4
//             WHERE 
//                 equipo.IdEquipo = ?;
//         `;
//         for (const equipo of DatosRemision.Detalles) {
//             const [tuplas] = await connection.query(CapturarCantidad, [equipo.IdEquipo]);
//             if (tuplas.length === 0) {
//                 throw new Error(`No se encontró el equipo con Id ${equipo.IdEquipo}`);
//             }
//             const ActualCantidad = Number(tuplas[0].Cantidad);
//             const CantidadARestar = Number(equipo.Cantidad);
//             const NuevaCantidad = (ActualCantidad - CantidadARestar);
//             if (NuevaCantidad < 0) {
//                 throw new Error(`Cantidad insuficiente para el equipo con Id ${equipo.IdEquipo}`);
//             }
//             console.log(`CantidadActual: ${ActualCantidad} - CantidadNueva: ${NuevaCantidad}`);
//             await connection.query(ReducirCantidadEquipo, [NuevaCantidad, equipo.IdEquipo]);
//             if (NuevaCantidad === 0) {
//                 await connection.query(CambiarEstadoEquipo, [equipo.IdEquipo]);
//             }
//         };
//         //...

//         //Se confirman todos los cambios
//         await connection.commit();
//         //...

//         //Se retorna resultado
//         return { success: true, IdRemision };
//         //...
//     } catch (error) {
//         await connection.rollback(); //Se revierten TODOS los cambios, si alguna operación falla.
//         console.error('Error al crear la remisión:', error);
//         throw new Error('Error al crear la remisión');
//     } finally {
//         connection.release(); //Liberar conexión
//     };
// };
// module.exports = {
//     CrearRemisionQuery
// };



const { query, pool } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

const CrearRemisionQuery = async (DatosRemision) => {
    // Validación inicial
    if (!DatosRemision || !DatosRemision.Detalles || DatosRemision.Detalles.length === 0) {
        throw new Error('Datos de remisión inválidos o vacíos');
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Configurar timeout para evitar operaciones colgadas
        // await connection.query('SET SESSION wait_timeout = 30');

        // 2. Validar tipos de datos numéricos
        const validarNumero = (valor, nombreCampo) => {
            const num = Number(valor);
            if (isNaN(num)) throw new Error(`${nombreCampo} debe ser un número válido`);
            return num;
        };

        // 3. Insertar remisión con parámetros validados
        const InsertarRemision = `
            INSERT INTO remisiones (
                NoRemision, DocumentoCliente, IdProyecto, 
                PrecioTotalGeneralSinIVA, IVA, PrecioTotalGeneralConIVA,
                IdBodega, DocumentoBodeguero, DocumentoDespachador,
                DocumentoTransportador, IdVehiculo, PlacaVehiculoRecibe,
                NombrePersonaRecibe, ObservacionesEmpresa, 
                UsuarioCreacion, FechaCreacion, IdEstado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [ResultadoRemision] = await connection.query(InsertarRemision, [
            DatosRemision.NoRemision,
            DatosRemision.DocumentoCliente,
            validarNumero(DatosRemision.IdProyecto, 'IdProyecto'),
            validarNumero(DatosRemision.PrecioTotalGeneralSinIVA, 'PrecioTotalGeneralSinIVA'),
            validarNumero(DatosRemision.IVA, 'IVA'),
            validarNumero(DatosRemision.PrecioTotalGeneralConIVA, 'PrecioTotalGeneralConIVA'),
            DatosRemision.IdBodega || null,
            DatosRemision.DocumentoBodeguero,
            DatosRemision.DocumentoDespachador,
            DatosRemision.DocumentoTransportador,
            DatosRemision.IdVehiculo || null,
            DatosRemision.PlacaVehiculoRecibe,
            DatosRemision.NombrePersonaRecibe,
            DatosRemision.ObservacionesEmpresa,
            DatosRemision.UsuarioCreacion,
            FechaActualColombia(),
            validarNumero(DatosRemision.IdEstado, 'IdEstado')
        ]);

        const IdRemision = ResultadoRemision.insertId;
        if (!IdRemision) throw new Error('No se pudo obtener el ID de la remisión');

        // 4. Insertar detalles con validación
        const InsertarDetallesRemision = `
            INSERT INTO detalles_remisiones (
                IdRemision, DocumentoSubarrendatario, IdCategoria,
                IdEquipo, Cantidad, PrecioUnidad,
                PrecioTotal, ObservacionesCliente
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        for (const detalle of DatosRemision.Detalles) {
            if (!detalle.IdEquipo || !detalle.Cantidad) {
                throw new Error('Detalle de remisión incompleto');
            }

            await connection.query(InsertarDetallesRemision, [
                IdRemision,
                detalle.DocumentoSubarrendatario || null,
                detalle.IdCategoria,
                detalle.IdEquipo,
                validarNumero(detalle.Cantidad, 'Cantidad'),
                validarNumero(detalle.PrecioUnidad, 'PrecioUnidad'),
                validarNumero(detalle.PrecioTotal, 'PrecioTotal'),
                detalle.ObservacionesCliente || null
            ]);
        }

        // 5. Actualizar inventario con mejor manejo de errores
        const ActualizarInventario = `
            UPDATE equipo 
            SET CantidadDisponible = GREATEST(0, CantidadDisponible - ?),
                IdEstado = CASE WHEN (CantidadDisponible - ?) <= 0 THEN 4 ELSE IdEstado END
            WHERE IdEquipo = ?`;

        // for (const equipo of DatosRemision.Detalles) {
        //     const cantidad = validarNumero(equipo.Cantidad, 'Cantidad');
        //     const [result] = await connection.query(ActualizarInventario, [
        //         cantidad, 
        //         cantidad, 
        //         equipo.IdEquipo
        //     ]);

        //     if (result.affectedRows === 0) {
        //         throw new Error(`No se encontró el equipo con Id ${equipo.IdEquipo}`);
        //     }
        // }

        for (const equipo of DatosRemision.Detalles) {
            const cantidad = validarNumero(equipo.Cantidad, 'Cantidad');

            // ⚡️ Solo descontar inventario si es de la empresa anfitriona
            if (!equipo.DocumentoSubarrendatario || equipo.DocumentoSubarrendatario === 'ABC') {
                const [result] = await connection.query(ActualizarInventario, [
                    cantidad,
                    cantidad,
                    equipo.IdEquipo
                ]);

                if (result.affectedRows === 0) {
                    throw new Error(`No se encontró el equipo con Id ${equipo.IdEquipo}`);
                }
            }
        }

        await connection.commit();
        return { success: true, IdRemision };

    } catch (error) {
        await connection.rollback();
        console.error('Error en CrearRemisionQuery:', error);
        throw new Error(`Error al crear remisión: ${error.message}`);
    } finally {
        if (connection) await connection.release();
    }
};

module.exports = { CrearRemisionQuery };