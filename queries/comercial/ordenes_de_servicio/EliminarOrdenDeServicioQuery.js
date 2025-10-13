const { pool } = require('../../../config/db');

const EliminarOrdenDeServicioQuery = async (IdOrdenDeServicio) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Obtener los detalles de la orden de servicio para actualizar los repuestos
        const [detalles] = await connection.query(
            `SELECT IdRepuesto, Cantidad FROM detalles_ordenes_de_servicio WHERE IdOrdenDeServicio = ? `,
            [IdOrdenDeServicio]
        );

        // 2. Eliminar los detalles de la orden de servicio
        await connection.query(
            `DELETE FROM detalles_ordenes_de_servicio
            WHERE IdOrdenDeServicio = ?`,
            [IdOrdenDeServicio]
        );

        // 3. Eliminar la orden de servicio principal
        await connection.query(
            `DELETE FROM ordenes_de_servicio
            WHERE IdOrdenDeServicio = ?`,
            [IdOrdenDeServicio]
        );

        // 4. Actualizar los respuestos "cantidad"
        for (const detalle of detalles) {
            const [repuesto] = await connection.query(
                `SELECT CantidadDisponible FROM repuestos WHERE IdRepuesto = ?`,
                [detalle.IdRepuesto]
            );
            const nuevaCantidadRepuesto = repuesto[0].CantidadDisponible + detalle.Cantidad;
            await connection.query(
                `UPDATE repuestos SET CantidadDisponible = ? WHERE IdRepuesto = ?`,
                [nuevaCantidadRepuesto, detalle.IdRepuesto]
            );
        }

        await connection.commit();
        return {
            success: true,
            message: 'Orden de servicio eliminada correctamnete',
            // detallesActualizados: detalles.length
        };

    } catch (error) {
        await connection.rollback();
        console.error('Error en EliminarOrdenDeServicioQuery: ', error);
    } finally {
        connection.release();
    }
};
module.exports = {
    EliminarOrdenDeServicioQuery
};