const { pool } = require('../../../config/db');
const { EmpresaAnfitriona } = require('../../../utils/constant/default');

const EliminarRemisionQuery = async (IdRemision) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Obtener los detalles de la remisión para actualizar los equipos
        const [detalles] = await connection.query(
            `SELECT IdEquipo, Cantidad, DocumentoSubarrendatario  FROM detalles_remisiones WHERE IdRemision = ?`,
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
            // Verificar si el equipo es propio antes de aumentar el stock
            const [prop] = await connection.query(`
                SELECT 
                    DocumentoSubarrendatario AS Propietario,
                    Cantidad AS CantidadTotal,
                    CantidadDisponible AS CantidadDisponible
                FROM 
                    equipo 
                WHERE 
                    IdEquipo = ?
            `, [detalle.IdEquipo]);

            // Se captura el documento del subarrendatario para compararlo con la empresa anfitriona
            const propietario = prop.length > 0 ? detalle.DocumentoSubarrendatario : null;
            const esPropio = propietario === EmpresaAnfitriona.value;

            if (!esPropio) {
                continue;
            }

            // Cantidad disponible del equipo
            const nuevaCantidadDisponible = prop[0].CantidadDisponible + detalle.Cantidad;
            // Cantidad total del equipo
            const cantidadTotal = prop[0].CantidadTotal;
            console.log(`DocumentoPropietario: ${propietario}, Cantidad Total: ${cantidadTotal}, Cantidad Disponible: ${nuevaCantidadDisponible}`);

            if (nuevaCantidadDisponible > cantidadTotal) {
                throw new Error('No se puede eliminar la remisión. La cantidad disponible excede la cantidad total.');
            }

            // Se actualiza la cantidad y el estado si la cantidad disponible es mayor a 0
            if (nuevaCantidadDisponible > 0) {
                await connection.query(
                    `UPDATE equipo SET CantidadDisponible = ?, IdEstado = 3 WHERE IdEquipo = ?`,
                    [nuevaCantidadDisponible, detalle.IdEquipo]
                );
            } else {
                // Si la cantidad disponible es 0, se marca como eliminado
                await connection.query(
                    `UPDATE equipo SET IdEstado = 4 WHERE IdEquipo = ?`,
                    [detalle.IdEquipo]
                );
            }
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