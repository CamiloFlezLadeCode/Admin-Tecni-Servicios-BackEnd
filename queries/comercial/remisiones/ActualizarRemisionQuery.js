const { pool } = require('../../../config/db');
const { EmpresaAnfitriona } = require('../../../utils/constant/default');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

/**
 * Actualiza una remisión validando si existen cambios reales antes de proceder con las operaciones en BD.
 * Incluye gestión de stock para equipos de la empresa anfitriona.
 * @param {Object} DatosActualizacion - Datos enviados desde el cliente
 */
const ActualizarRemisionQuery = async (DatosActualizacion) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const {
            IdRemision,
            IdEstado,
            ObservacionesEmpresa,
            IVA,
            IncluyeTransporte,
            ValorTransporte,
            PrecioTotalGeneralSinIVA,
            PrecioTotalGeneralConIVA,
            Detalles,
            UsuarioQueActualiza,
            // UsuarioActualizacion // Asumimos que viene el usuario que realiza el cambio
            IdProyecto,
        } = DatosActualizacion;

        // 1. Obtener datos actuales de la remisión
        const [remisionExistente] = await connection.query(
            'SELECT * FROM remisiones WHERE IdRemision = ?',
            [IdRemision]
        );

        if (remisionExistente.length === 0) {
            return {
                success: false,
                huboCambios: false,
                mensaje: 'Remisión no encontrada',
                razon: 'no_existe'
            };
        }

        const remisionActual = remisionExistente[0];

        // 2. Comparar cambios en cabecera (Normalizando tipos de datos)
        const cambiosCabecera = {
            // IdEstado: Number(IdEstado) !== Number(remisionActual.IdEstado),
            ObservacionesEmpresa: (ObservacionesEmpresa || '').trim() !== (remisionActual.ObservacionesEmpresa || '').trim(),
            IVA: Number(IVA || 0).toFixed(2) !== Number(remisionActual.IVA || 0).toFixed(2),
            IncluyeTransporte: (IncluyeTransporte ? 1 : 0) !== remisionActual.IncluyeTransporte,
            ValorTransporte: Number(ValorTransporte || 0).toFixed(2) !== Number(remisionActual.ValorTransporte || 0).toFixed(2),
            PrecioTotalGeneralSinIVA: Number(PrecioTotalGeneralSinIVA || 0).toFixed(2) !== Number(remisionActual.PrecioTotalGeneralSinIVA || 0).toFixed(2),
            PrecioTotalGeneralConIVA: Number(PrecioTotalGeneralConIVA || 0).toFixed(2) !== Number(remisionActual.PrecioTotalGeneralConIVA || 0).toFixed(2),
            IdProyecto: Number(IdProyecto) !== Number(remisionActual.IdProyecto),
        };

        const huboCambiosCabecera = Object.values(cambiosCabecera).some(cambio => cambio);

        // 3. Obtener detalles actuales para comparación y stock
        const [detallesAnteriores] = await connection.query(
            `SELECT 
                DocumentoSubarrendatario, 
                IdCategoria,
                IdEquipo, 
                Cantidad, 
                PrecioUnidad,
                PrecioTotal, 
                ObservacionesCliente
             FROM detalles_remisiones 
             WHERE IdRemision = ?`,
            [IdRemision]
        );

        // 4. Preparar detalles nuevos (filtrando transporte y normalizando)
        const detallesNuevos = Detalles
            .filter(det => Number(det.IdEquipo) !== 0)
            .map(det => ({
                DocumentoSubarrendatario: det.DocumentoSubarrendatario ? String(det.DocumentoSubarrendatario).trim() : null,
                IdCategoria: Number(det.IdCategoria),
                IdEquipo: Number(det.IdEquipo),
                Cantidad: Number(det.Cantidad),
                PrecioUnidad: Number(det.PrecioUnidad || 0),
                PrecioTotal: Number(det.PrecioTotal || 0),
                ObservacionesCliente: (det.ObservacionesCliente || '').trim()
            }));

        // 5. Comparación profunda de detalles para saber si hubo cambios en la estructura
        const compararEstructuraDetalles = (anteriores, nuevos) => {
            if (anteriores.length !== nuevos.length) return true;

            const normalizar = (det) =>
                `${det.IdEquipo}|${det.Cantidad}|${Number(det.PrecioUnidad).toFixed(2)}|${Number(det.PrecioTotal).toFixed(2)}|${det.IdCategoria}|${det.DocumentoSubarrendatario ? String(det.DocumentoSubarrendatario).trim() : 'null'}|${(det.ObservacionesCliente || '').trim()}`;

            const setAnteriores = new Set(anteriores.map(normalizar));
            const setNuevos = new Set(nuevos.map(normalizar));

            if (setAnteriores.size !== setNuevos.size) return true;

            for (const item of setNuevos) {
                if (!setAnteriores.has(item)) return true;
            }

            return false;
        };

        const huboCambiosDetalles = compararEstructuraDetalles(detallesAnteriores, detallesNuevos);

        // 6. GESTIÓN DE STOCK (Solo si hubo cambios en los detalles)
        if (huboCambiosDetalles) {
            // A. Calcular diferencias de cantidades por IdEquipo (Solo para Empresa Anfitriona)
            const diffsStock = new Map(); // IdEquipo -> DeltaQuantity

            const esAnfitriona = (doc) => !doc || doc === EmpresaAnfitriona.value;

            // Restar cantidades anteriores
            detallesAnteriores.forEach(det => {
                if (esAnfitriona(det.DocumentoSubarrendatario)) {
                    const id = Number(det.IdEquipo);
                    diffsStock.set(id, (diffsStock.get(id) || 0) - Number(det.Cantidad));
                }
            });

            // Sumar cantidades nuevas
            detallesNuevos.forEach(det => {
                if (esAnfitriona(det.DocumentoSubarrendatario)) {
                    const id = Number(det.IdEquipo);
                    diffsStock.set(id, (diffsStock.get(id) || 0) + Number(det.Cantidad));
                }
            });

            // B. Validar y actualizar stock
            for (const [idEquipo, delta] of diffsStock.entries()) {
                if (delta === 0) continue; // No hay cambio neto para este equipo

                // Si delta > 0, se está pidiendo más equipo, verificar disponibilidad
                if (delta > 0) {
                    const [equipoInfo] = await connection.query(
                        'SELECT CantidadDisponible, Nombre FROM equipo WHERE IdEquipo = ?',
                        [idEquipo]
                    );

                    if (equipoInfo.length === 0) {
                        throw new Error(`No se encontró el equipo con Id ${idEquipo}`);
                    }

                    const disponible = Number(equipoInfo[0].CantidadDisponible);
                    if (disponible < delta) {
                        await connection.rollback();
                        return {
                            success: false,
                            mensaje: `Stock insuficiente para el equipo "${equipoInfo[0].Nombre}". Disponible: ${disponible}, Requerido adicional: ${delta}`
                        };
                    }
                }

                // C. Actualizar CantidadDisponible e IdEstado
                const sqlUpdateStock = `
                    UPDATE equipo 
                    SET 
                        CantidadDisponible = CantidadDisponible - ?,
                        IdEstado = CASE 
                            WHEN (CantidadDisponible - ?) <= 0 THEN 4 
                            WHEN (CantidadDisponible - ?) > 0 THEN 3
                            ELSE IdEstado 
                        END
                    WHERE IdEquipo = ?
                `;
                await connection.query(sqlUpdateStock, [delta, delta, delta, idEquipo]);

                // D. Registrar movimiento de equipo
                const sqlInsertMovimiento = `
                    INSERT INTO movimiento_equipo (
                        IdEquipo, Fecha, IdTipoMovimiento, Direccion, Cantidad,
                        DocumentoReferencia, IdDocumentoOrigen, UsuarioCreacion, FechaRegistro
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                // Si delta > 0 es SALIDA, si delta < 0 es ENTRADA (se devuelve stock)
                const direccion = delta > 0 ? 'SALIDA' : 'ENTRADA';
                const cantidadMovimiento = Math.abs(delta);
                // Tipo de movimiento: 1 para Remisión (ajuste), o podrías definir uno específico
                const idTipoMovimiento = 1;

                await connection.query(sqlInsertMovimiento, [
                    idEquipo,
                    remisionActual.FechaRemision || FechaActualColombia(),
                    idTipoMovimiento,
                    direccion,
                    cantidadMovimiento,
                    remisionActual.NoRemision,
                    IdRemision,
                    UsuarioQueActualiza,
                    FechaActualColombia()
                ]);
            }
        }

        // 7. OPTIMIZACIÓN FINAL: Si no hay cambios ni en cabecera ni en estructura de detalles, retornar
        if (!huboCambiosCabecera && !huboCambiosDetalles) {
            await connection.rollback();
            return {
                success: true,
                huboCambios: false,
                mensaje: 'No se detectaron cambios. Los datos son idénticos a los actuales.'
            };
        }

        // 8. Si hay cambios, proceder con las actualizaciones de BD
        if (huboCambiosCabecera) {
            const sqlUpdateHeader = `
                UPDATE remisiones 
                SET 
                    IdEstado = ?, 
                    ObservacionesEmpresa = ?, 
                    IVA = ?, 
                    IncluyeTransporte = ?, 
                    ValorTransporte = ?, 
                    PrecioTotalGeneralSinIVA = ?, 
                    PrecioTotalGeneralConIVA = ?,
                    FechaUltimaActualizacion = ?,
                    UsuarioQueActualiza = ?,
                    IdProyecto = ?
                WHERE 
                    IdRemision = ?
            `;

            await connection.query(sqlUpdateHeader, [
                17,
                ObservacionesEmpresa,
                IVA,
                IncluyeTransporte ? 1 : 0,
                ValorTransporte || 0,
                PrecioTotalGeneralSinIVA,
                PrecioTotalGeneralConIVA,
                FechaActualColombia(),
                UsuarioQueActualiza,
                IdProyecto,
                IdRemision,

            ]);
        }

        if (huboCambiosDetalles) {
            await connection.query('DELETE FROM detalles_remisiones WHERE IdRemision = ?', [IdRemision]);

            if (detallesNuevos.length > 0) {
                const sqlInsertDetalle = `
                    INSERT INTO detalles_remisiones (
                        IdRemision, DocumentoSubarrendatario, IdCategoria,
                        IdEquipo, Cantidad, PrecioUnidad,
                        PrecioTotal, ObservacionesCliente
                    ) VALUES ?
                `;

                const values = detallesNuevos.map(det => [
                    IdRemision,
                    det.DocumentoSubarrendatario,
                    det.IdCategoria,
                    det.IdEquipo,
                    det.Cantidad,
                    det.PrecioUnidad,
                    det.PrecioTotal,
                    det.ObservacionesCliente
                ]);

                await connection.query(sqlInsertDetalle, [values]);
            }
        }

        await connection.commit();
        return {
            success: true,
            huboCambios: true,
            mensaje: 'Remisión actualizada correctamente'
        };

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error en ActualizarRemisionQuery => ', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    ActualizarRemisionQuery
};