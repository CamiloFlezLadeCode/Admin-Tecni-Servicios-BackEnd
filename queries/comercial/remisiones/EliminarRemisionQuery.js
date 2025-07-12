const { pool } = require('../../../config/db');

const EliminarRemisionQuery = async (IdRemision) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Obtener los detalles de la remisión para actualizar los equipos
        const [detalles] = await connection.query(
            `SELECT IdEquipo, Cantidad FROM detalles_remisiones WHERE IdRemision = ?`,
            [IdRemision]
        );

        // 2. Eliminar los detalles de la remisión
        await connection.query(
            `DELETE FROM detalles_remisiones WHERE IdRemision = ?`,
            [IdRemision]
        );

        // 3. Eliminar la remisión principal
        await connection.query(
            `DELETE FROM remisiones WHERE IdRemision = ?`,
            [IdRemision]
        );

        // 4. Actualizar la cantidad de equipos
        for (const detalle of detalles) {
            const [equipo] = await connection.query(
                `SELECT CantidadDisponible FROM equipo WHERE IdEquipo = ?`,
                [detalle.IdEquipo]
            );

            const nuevaCantidad = equipo[0].CantidadDisponible + detalle.Cantidad;

            await connection.query(
                `UPDATE equipo SET CantidadDisponible = ? WHERE IdEquipo = ?`,
                [nuevaCantidad, detalle.IdEquipo]
            );
        }

        await connection.commit();
        return { success: true, message: 'Remisión eliminada correctamente' };
    } catch (error) {
        await connection.rollback();
        console.error('Error en EliminarRemisionQuery:', error);
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    EliminarRemisionQuery
};