const { query, pool } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

const GuardarEntradaEquiposQuery = async (DataEntradaEquipos) => {
    // if (!DataEntradaEquipos || !DataEntradaEquipos.Equipos || DataEntradaEquipos.Equipos.length === 0) {
    //     throw new Error('Datos de entrada inválidos ó vacios');
    // };

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const InsertarEntradaEquipos = `
            INSERT INTO 
                entrada_equipo 
                (
                    NoEntradaEquipos, 
                    FechaEntrada, 
                    Responsable, 
                    Observaciones, 
                    UsuarioCreacion, 
                    FechaCreacion
                ) 
            VALUES 
                ( ?, ?, ?, ?, ?, ?);
        `;
        const [ResultadoInsertarEntradaEquipos] = await connection.query(InsertarEntradaEquipos, [
            DataEntradaEquipos.NoEntradaEquipos,
            DataEntradaEquipos.FechaEntrada,
            DataEntradaEquipos.DocumentoResponsable,
            DataEntradaEquipos.Observaciones,
            DataEntradaEquipos.UsuarioCreacion,
            FechaActualColombia()
        ]);
        const IdEntradaEquipos = ResultadoInsertarEntradaEquipos.insertId;
        if (!IdEntradaEquipos) throw new Error('No se pudo obtener el ID de la entrada de los equipos');

        const InsertarDetallesEntradaEquipos = `
            INSERT INTO 
                entrada_equipo_detalle 
                (
                    IdEntradaEquipo, 
                    IdEquipo, 
                    Cantidad, 
                    IdUnidadDeMedida, 
                    IdEstado, 
                    Observaciones
                ) 
            VALUES 
                ( ?, ?, ?, ?, ?, ? );
        `;
        for (const detalle_entrada of DataEntradaEquipos.Equipos) {
            if (!detalle_entrada.IdEquipo || !detalle_entrada.Cantidad) {
                throw new Error('Detalle de remisión incompleto');
            }
            await connection.query(InsertarDetallesEntradaEquipos, [
                IdEntradaEquipos,
                detalle_entrada.IdEquipo,
                detalle_entrada.Cantidad,
                detalle_entrada.IdUnidadMedida,
                detalle_entrada.IdEstado,
                detalle_entrada.Observacion
            ]);
        };

        await connection.commit();
        return { success: true, IdEntradaEquipos };
    } catch (error) {
        await connection.rollback();
        console.error('Error al crear la entrada de los equipos', error);
        throw new Error(`'Error al crear la entrada: ${error.message}`);
    } finally {
        if (connection) await connection.release();
    }
};
module.exports = {
    GuardarEntradaEquiposQuery
};