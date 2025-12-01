const { query, pool } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

const GuardarSalidaRepuestosQuery = async (DataSalidaRepuestos) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const InsertarSalidaRepuestos = `
            INSERT INTO
                salida_repuesto
                (
                    NoSalidaRepuestos,
                    FechaSalida,
                    Responsable,
                    Observaciones,
                    UsuarioCreacion,
                    FechaCreacion
                )
            VALUES
                ( ?, ?, ?, ?, ?, ? )
        `;
        const [ResultadoInsertarSalidaRepuestos] = await connection.query(InsertarSalidaRepuestos, [
            DataSalidaRepuestos.NoSalidaRepuestos,
            DataSalidaRepuestos.FechaSalida,
            DataSalidaRepuestos.DocumentoResponsable,
            DataSalidaRepuestos.Observaciones,
            DataSalidaRepuestos.UsuarioCreacion,
            FechaActualColombia()
        ]);
        const IdSalidaRepuestos = ResultadoInsertarSalidaRepuestos.insertId;
        if (!IdSalidaRepuestos) throw new Error('No se pudo obtener el ID de la salida de los repuestos');

        const InsertarDetallesSalidaRepuestos = `
            INSERT INTO
                salida_detalle_repuesto
                (
                    IdSalidaRepuesto,
                    IdRepuesto,
                    Cantidad,
                    IdUnidadDeMedida,
                    IdEstado,
                    Observaciones
                )
            VALUES
                ( ?, ?, ?, ?, ?, ? )
        `;
        for (const detalle_salida of DataSalidaRepuestos.Repuestos) {
            if (!detalle_salida.IdRepuesto || !detalle_salida.Cantidad) {
                throw new Error('Detalle de salida incompleto');
            }
            await connection.query(InsertarDetallesSalidaRepuestos, [
                IdSalidaRepuestos,
                detalle_salida.IdRepuesto,
                detalle_salida.Cantidad,
                detalle_salida.IdUnidadMedida,
                detalle_salida.IdEstado,
                detalle_salida.Observacion
            ]);

            const [info] = await connection.query(
                `SELECT Nombre, CantidadDisponible FROM repuestos WHERE IdRepuesto = ?`,
                [detalle_salida.IdRepuesto]
            );
            const disponible = Number(info[0]?.CantidadDisponible || 0);
            const requerido = Number(detalle_salida.Cantidad);
            const nombreRepuesto = info[0]?.Nombre || '';
            if (disponible < requerido) {
                throw new Error(`Stock insuficiente para el repuesto ${nombreRepuesto} (ID: ${detalle_salida.IdRepuesto}). Disponible: ${disponible}, Requerido: ${requerido}`);
            }
            await connection.query(
                `UPDATE repuestos SET CantidadDisponible = CantidadDisponible - ? WHERE IdRepuesto = ?`,
                [requerido, detalle_salida.IdRepuesto]
            );

            const InsertarMovimiento = `
                INSERT INTO movimiento_repuesto (
                    IdRepuesto, Fecha, IdTipoMovimiento, Direccion, Cantidad,
                    DocumentoReferencia, IdDocumentoOrigen, UsuarioCreacion, FechaRegistro
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            await connection.query(InsertarMovimiento, [
                detalle_salida.IdRepuesto,
                DataSalidaRepuestos.FechaSalida || FechaActualColombia(),
                DataSalidaRepuestos.IdTipoMovimiento || 5,
                'SALIDA',
                Number(detalle_salida.Cantidad),
                DataSalidaRepuestos.NoSalidaRepuestos,
                IdSalidaRepuestos,
                DataSalidaRepuestos.UsuarioCreacion,
                FechaActualColombia()
            ]);
        }

        await connection.commit();
        return { success: true, IdSalidaRepuestos };
    } catch (error) {
        await connection.rollback();
        throw new Error(`Error al crear salida de repuestos: ${error.message}`);
    } finally {
        if (connection) await connection.release();
    }
};
module.exports = {
    GuardarSalidaRepuestosQuery
};