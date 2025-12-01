const { query } = require('../../../config/db');

const VisualizarSalidaRepuestosQuery = async (NoSalidaRepuestos) => {
    const sql = `
        SELECT
            sr.NoSalidaRepuestos,
            sr.FechaSalida,
            sr.Responsable AS DocumentoResponsable,
            sr.Responsable,
            CONCAT(p.Nombres, ' ', p.Apellidos) AS NombreResponsable,
            sr.Observaciones,
            sr.UsuarioCreacion,
            CONCAT(uc.Nombres, ' ', uc.Apellidos) AS CreadoPor,
            sr.FechaCreacion,
            COALESCE((
                SELECT MAX(mr.IdTipoMovimiento)
                FROM movimiento_repuesto mr
                WHERE mr.IdDocumentoOrigen = sr.IdSalidaRepuesto
            ), 5) AS IdTipoMovimiento,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'IdRepuesto', sdr.IdRepuesto,
                        'Repuesto', r.Nombre,
                        'Cantidad', sdr.Cantidad,
                        'IdUnidadDeMedida', sdr.IdUnidadDeMedida,
                        'UnidadMedida', um.Nombre,
                        'IdEstado', sdr.IdEstado,
                        'Estado', est.Estado,
                        'Observaciones', sdr.Observaciones
                    )
                )
                FROM salida_detalle_repuesto sdr
                LEFT JOIN repuestos r ON sdr.IdRepuesto = r.IdRepuesto
                LEFT JOIN unidad um ON sdr.IdUnidadDeMedida = um.IdUnidad
                LEFT JOIN estado est ON sdr.IdEstado = est.IdEstado
                WHERE sdr.IdSalidaRepuesto = sr.IdSalidaRepuesto
            ) AS Repuestos
        FROM
            salida_repuesto AS sr
        LEFT JOIN usuario p ON sr.Responsable = p.DocumentoUsuario COLLATE utf8mb4_0900_ai_ci
        LEFT JOIN usuario uc ON sr.UsuarioCreacion = uc.DocumentoUsuario COLLATE utf8mb4_0900_ai_ci
        WHERE sr.NoSalidaRepuestos = ?
    `;
    return query(sql, [NoSalidaRepuestos]);
};
module.exports = {
    VisualizarSalidaRepuestosQuery
};