const { query, pool } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

const GuardarSalidaEquiposQuery = async (DataSalidaEquipos) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const InsertarSalidaEquipos = `
            INSERT INTO 
                salida_equipo 
                (
                    NoSalidaEquipo, 
                    FechaSalida, 
                    Responsable, 
                    Observaciones, 
                    UsuarioCreacion, 
                    FechaCreacion
                ) 
            VALUES 
                ( ?, ?, ?, ?, ?, ? );
        `;
        const [ResultadoInsertarSalidaEquipos] = await connection.query(InsertarSalidaEquipos, [
            DataSalidaEquipos.NoSalidaEquipos,
            DataSalidaEquipos.FechaSalida,
            DataSalidaEquipos.DocumentoResponsable,
            DataSalidaEquipos.Observaciones,
            DataSalidaEquipos.UsuarioCreacion,
            FechaActualColombia()
        ]);
        const IdSalidaEquipo = ResultadoInsertarSalidaEquipos.insertId;
        if (!IdSalidaEquipo) throw new Error('No se pudo obtener el ID de la salida de equipos');

        const InsertarDetallesSalidaEquipos = `
            INSERT INTO 
                salida_detalle_equipo 
                (
                    IdSalidaEquipo, 
                    IdEquipo, 
                    Cantidad, 
                    IdUnidadDeMedida, 
                    IdEstado, 
                    Observaciones
                ) 
            VALUES 
                ( ?, ?, ?, ?, ?, ? );
        `;
        
        // Obtener IdTipoMovimiento de la solicitud o usar valor por defecto
        let IdTipoMovimiento = DataSalidaEquipos.IdTipoMovimiento;
        if (!IdTipoMovimiento) {
            // Intentar buscar 'SALIDA' si no se proporciona ID
            const [tipoMov] = await connection.query(`SELECT IdTipoMovimiento FROM cat_tipos_movimiento_equipo WHERE Nombre = 'SALIDA' LIMIT 1`);
            IdTipoMovimiento = tipoMov.length > 0 ? tipoMov[0].IdTipoMovimiento : 20; // Default a 20 si no se encuentra
        }

        for (const detalle_salida of DataSalidaEquipos.Equipos) {
            if (!detalle_salida.IdEquipo || !detalle_salida.Cantidad) {
                throw new Error('Detalle de salida incompleto');
            }
            await connection.query(InsertarDetallesSalidaEquipos, [
                IdSalidaEquipo,
                detalle_salida.IdEquipo,
                detalle_salida.Cantidad,
                detalle_salida.IdUnidadMedida,
                detalle_salida.IdEstado,
                detalle_salida.Observacion
            ]);

            // Verificar y Actualizar Stock
            const [info] = await connection.query(
                `SELECT Nombre, Cantidad FROM equipo WHERE IdEquipo = ?`,
                [detalle_salida.IdEquipo]
            );
            const disponible = Number(info[0]?.Cantidad || 0);
            const requerido = Number(detalle_salida.Cantidad);
            const nombreEquipo = info[0]?.Nombre || '';
            
            if (disponible < requerido) {
                throw new Error(`Stock insuficiente para el equipo ${nombreEquipo} (ID: ${detalle_salida.IdEquipo}). Disponible: ${disponible}, Requerido: ${requerido}`);
            }
            
            await connection.query(
                `UPDATE equipo SET Cantidad = Cantidad - ? WHERE IdEquipo = ?`,
                [requerido, detalle_salida.IdEquipo]
            );

            // Registrar movimiento de equipo
            const InsertarMovimiento = `
                INSERT INTO movimiento_equipo (
                    IdEquipo, Fecha, IdTipoMovimiento, Direccion, Cantidad,
                    DocumentoReferencia, IdDocumentoOrigen, UsuarioCreacion, FechaRegistro
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            await connection.query(InsertarMovimiento, [
                detalle_salida.IdEquipo,
                DataSalidaEquipos.FechaSalida || FechaActualColombia(),
                IdTipoMovimiento,
                'SALIDA',
                Number(detalle_salida.Cantidad),
                DataSalidaEquipos.NoSalidaEquipos,
                IdSalidaEquipo,
                DataSalidaEquipos.UsuarioCreacion,
                FechaActualColombia()
            ]);
        };

        await connection.commit();
        return { success: true, IdSalidaEquipo };
    } catch (error) {
        await connection.rollback();
        console.error('Error al crear la salida de equipos', error);
        throw new Error(`Error al crear la salida: ${error.message}`);
    } finally {
        if (connection) await connection.release();
    }
};
module.exports = {
    GuardarSalidaEquiposQuery
};
