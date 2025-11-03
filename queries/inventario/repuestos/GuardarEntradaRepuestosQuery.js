const { query, pool } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

const GuardarEntradaRepuestosQuery = async (DataEntradaRepuestos) => {
    const connection = await pool.getConnection();
    try {
        const InsertarEntradaRepuestos = `
            INSERT INTO
                entrada_repuesto
                (
                    NoEntradaRepuestos,
                    FechaEntrada,
                    Responsable,
                    Observaciones,
                    UsuarioCreacion,
                    FechaCreacion
                )
            VALUES
                ( ?, ?, ?, ?, ?, ? )
        `;
        const [ResultadoInsertarEntradaRepuestos] = await connection.query(InsertarEntradaRepuestos, [
            DataEntradaRepuestos.NoEntradaRepuestos,
            DataEntradaRepuestos.FechaEntrada,
            DataEntradaRepuestos.DocumentoResponsable,
            DataEntradaRepuestos.Observaciones,
            DataEntradaRepuestos.UsuarioCreacion,
            FechaActualColombia()
        ]);
        const IdEntradaRepuestos = ResultadoInsertarEntradaRepuestos.insertId;
        if (!IdEntradaRepuestos) throw new Error('No se pudo obtener el ID de la entrada de los repuestos');

        const InsertarDetallesEntradaRepuestos = `
            INSERT INTO
                entrada_repuesto_detalle
                (
                    IdEntradaRepuesto,
                    IdRepuesto,
                    Cantidad,
                    IdUnidadDeMedida,
                    IdEstado,
                    Observaciones
                )
            VALUES
                ( ?, ?, ?, ?, ?, ? )
        `;
        for (const detalle_entrada of DataEntradaRepuestos.Repuestos) {
            if (!detalle_entrada.IdRepuesto || !detalle_entrada.Cantidad) {
                throw new Error('Detalle de entrada incompleto');
            }
            await connection.query(InsertarDetallesEntradaRepuestos, [
                IdEntradaRepuestos,
                detalle_entrada.IdRepuesto,
                detalle_entrada.Cantidad,
                detalle_entrada.IdUnidadMedida,
                detalle_entrada.IdEstado,
                detalle_entrada.Observacion
            ]);
        };

        await connection.commit();
        return { success: true, IdEntradaRepuestos };
    } catch (error) {
        await connection.rollback();
        console.error('Error al crear la entrada de los repuestos', error);
        throw new Error(`'Error al crear la entrada: ${error.message}`);
    } finally {
        if (connection) await connection.release();
    }
};
module.exports = {
    GuardarEntradaRepuestosQuery
};