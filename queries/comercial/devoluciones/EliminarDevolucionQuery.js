const { pool } = require('../../../config/db');
const { EmpresaAnfitriona } = require('../../../utils/constant/default');

const EliminarDevolucionQuery = async (IdDevolucion) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Obtener los detalles de la devolución para actualizar los equipos
        const [detalles] = await connection.query(
            `SELECT IdEquipo, Cantidad, IdRemision
             FROM detalles_devoluciones 
             WHERE IdDevolucion = ?`,
            [IdDevolucion]
        );

        // 2. Actualizar la cantidad disponible de equipos (DECREMENTAR)
        for (const detalle of detalles) {
            const [prop] = await connection.query(
                `SELECT
                    DocumentoSubarrendatario AS Propietario
                FROM
                    detalles_remisiones
                WHERE IdRemision = ? AND IdEquipo = ?
                LIMIT 1`,
                [detalle.IdRemision, detalle.IdEquipo]
            );

            const propietario = prop.length > 0 ? String(prop[0].Propietario ?? '').trim() : null;
            const esPropio = propietario === String(EmpresaAnfitriona.value).trim();

            if (!esPropio) {
                continue;
            }

            const [[equipo]] = await connection.query(
                `SELECT CantidadDisponible 
                 FROM equipo 
                 WHERE IdEquipo = ? 
                 FOR UPDATE`,
                [detalle.IdEquipo]
            );

            if (!equipo) {
                throw new Error(`No se encontró el equipo ${detalle.IdEquipo}`);
            }

            const nuevaCantidad = Number(equipo.CantidadDisponible) - Number(detalle.Cantidad);

            if (nuevaCantidad < 0) {
                throw new Error(`La cantidad no puede ser negativa para el equipo ${detalle.IdEquipo}`);
            }

            if (nuevaCantidad == 0) {
                await connection.query(
                    `UPDATE equipo 
                    SET CantidadDisponible = ?, IdEstado = 4 
                    WHERE IdEquipo = ?`,
                    [nuevaCantidad, detalle.IdEquipo]
                );
            } else {
                await connection.query(
                    `UPDATE equipo 
                    SET CantidadDisponible = ?, IdEstado = 3 
                    WHERE IdEquipo = ?`,
                    [nuevaCantidad, detalle.IdEquipo]
                )
            }
        }

        // 3. Eliminar los detalles de la devolución
        await connection.query(
            `DELETE FROM detalles_devoluciones 
             WHERE IdDevolucion = ?`,
            [IdDevolucion]
        );

        // 4. Eliminar la devolución principal
        await connection.query(
            `DELETE FROM devoluciones 
             WHERE IdDevolucion = ?`,
            [IdDevolucion]
        );

        await connection.commit();
        return {
            success: true,
            message: 'Devolución eliminada correctamente',
            detallesActualizados: detalles.length
        };
    } catch (error) {
        await connection.rollback();
        console.error('Error en EliminarDevolucionQuery:', error);
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    EliminarDevolucionQuery
};