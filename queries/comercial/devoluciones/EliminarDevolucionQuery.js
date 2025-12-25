const { pool } = require('../../../config/db');
const { EmpresaAnfitriona } = require('../../../utils/constant/default');

const EliminarDevolucionQuery = async (IdDevolucion) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Obtener los detalles de la devolución para actualizar los equipos
        const [detalles] = await connection.query(
            `SELECT IdEquipo, Cantidad 
             FROM detalles_devoluciones 
             WHERE IdDevolucion = ?`,
            [IdDevolucion]
        );

        // 2. Eliminar los detalles de la devolución
        await connection.query(
            `DELETE FROM detalles_devoluciones 
             WHERE IdDevolucion = ?`,
            [IdDevolucion]
        );

        // 3. Eliminar la devolución principal
        await connection.query(
            `DELETE FROM devoluciones 
             WHERE IdDevolucion = ?`,
            [IdDevolucion]
        );

        // 4. Actualizar la cantidad disponible de equipos (DECREMENTAR)
        for (const detalle of detalles) {
            // Verificar si es equipo propio antes de descontar stock
            const [prop] = await connection.query(
                `SELECT DocumentoSubarrendatario AS Propietario FROM equipo WHERE IdEquipo = ?`,
                [detalle.IdEquipo]
            );

            const propietario = prop.length > 0 ? prop[0].Propietario : null;
            const esPropio = propietario === EmpresaAnfitriona.value;

            if (!esPropio) {
                continue;
            }

            // Obtener cantidad actual
            const [[equipo]] = await connection.query(
                `SELECT CantidadDisponible 
                 FROM equipo 
                 WHERE IdEquipo = ? 
                 FOR UPDATE`, // Bloqueo para evitar condiciones de carrera
                [detalle.IdEquipo]
            );

            const nuevaCantidad = equipo.CantidadDisponible - detalle.Cantidad;

            if (nuevaCantidad < 0) {
                throw new Error(`La cantidad no puede ser negativa para el equipo ${detalle.IdEquipo}`);
            }

            await connection.query(
                `UPDATE equipo 
                 SET CantidadDisponible = ? 
                 WHERE IdEquipo = ?`,
                [nuevaCantidad, detalle.IdEquipo]
            );
        }

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