const { query } = require('../../../config/db');

const VisualizarSalidaRepuestosQuery = async (NoSalidaRepuestos) => {
    // const sql = `
    //     SELECT
    //         sr.NoSalidaRepuestos,
    //         sr.FechaSalida,
    //         sr.Responsable AS DocumentoResponsable,
    //         sr.Responsable,
    //         CONCAT(p.Nombres, ' ', p.Apellidos) AS NombreResponsable,
    //         sr.Observaciones,
    //         sr.UsuarioCreacion,
    //         CONCAT(uc.Nombres, ' ', uc.Apellidos) AS CreadoPor,
    //         sr.FechaCreacion,
    //         COALESCE((
    //             SELECT MAX(mr.IdTipoMovimiento)
    //             FROM movimiento_repuesto mr
    //             WHERE mr.IdDocumentoOrigen = sr.IdSalidaRepuesto
    //         ), 5) AS IdTipoMovimiento,
    //         (
    //             SELECT JSON_ARRAYAGG(
    //                 JSON_OBJECT(
    //                     'IdRepuesto', sdr.IdRepuesto,
    //                     'Repuesto', r.Nombre,
    //                     'Cantidad', sdr.Cantidad,
    //                     'IdUnidadDeMedida', sdr.IdUnidadDeMedida,
    //                     'UnidadMedida', um.Nombre,
    //                     'IdEstado', sdr.IdEstado,
    //                     'Estado', est.Estado,
    //                     'Observaciones', sdr.Observaciones
    //                 )
    //             )
    //             FROM salida_detalle_repuesto sdr
    //             LEFT JOIN repuestos r ON sdr.IdRepuesto = r.IdRepuesto
    //             LEFT JOIN unidad um ON sdr.IdUnidadDeMedida = um.IdUnidad
    //             LEFT JOIN estado est ON sdr.IdEstado = est.IdEstado
    //             WHERE sdr.IdSalidaRepuesto = sr.IdSalidaRepuesto
    //         ) AS Repuestos
    //     FROM
    //         salida_repuesto AS sr
    //     LEFT JOIN usuario p ON sr.Responsable = p.DocumentoUsuario
    //     LEFT JOIN usuario uc ON sr.UsuarioCreacion = uc.DocumentoUsuario
    //     WHERE sr.NoSalidaRepuestos = ?
    // `;
    // const sql = `
    //     SELECT
    //         sr.NoSalidaRepuestos,
    //         sr.FechaSalida,
    //         sr.Responsable AS DocumentoResponsable,
    //         sr.Responsable,
    //         CONCAT(p.Nombres, ' ', p.Apellidos) AS NombreResponsable,
    //         sr.Observaciones,
    //         sr.UsuarioCreacion,
    //         CONCAT(uc.Nombres, ' ', uc.Apellidos) AS CreadoPor,
    //         sr.FechaCreacion,
    //         COALESCE(mr_max.IdTipoMovimiento, 5) AS IdTipoMovimiento,
    //         JSON_ARRAYAGG(
    //             JSON_OBJECT(
    //                 'IdRepuesto', sdr.IdRepuesto,
    //                 'Repuesto', r.Nombre,
    //                 'Cantidad', sdr.Cantidad,
    //                 'IdUnidadDeMedida', sdr.IdUnidadDeMedida,
    //                 'UnidadMedida', um.Nombre,
    //                 'IdEstado', sdr.IdEstado,
    //                 'Estado', est.Estado,
    //                 'Observaciones', sdr.Observaciones
    //             )
    //         ) AS Repuestos
    //     FROM salida_repuesto AS sr
    //     LEFT JOIN usuario p ON sr.Responsable = p.DocumentoUsuario
    //     LEFT JOIN usuario uc ON sr.UsuarioCreacion = uc.DocumentoUsuario
    //     LEFT JOIN (
    //         SELECT 
    //             IdDocumentoOrigen,
    //             MAX(IdTipoMovimiento) AS IdTipoMovimiento
    //         FROM movimiento_repuesto
    //         GROUP BY IdDocumentoOrigen
    //     ) AS mr_max ON mr_max.IdDocumentoOrigen = sr.IdSalidaRepuesto
    //     LEFT JOIN salida_detalle_repuesto sdr ON sdr.IdSalidaRepuesto = sr.IdSalidaRepuesto
    //     LEFT JOIN repuestos r ON sdr.IdRepuesto = r.IdRepuesto
    //     LEFT JOIN unidad um ON sdr.IdUnidadDeMedida = um.IdUnidad
    //     LEFT JOIN estado est ON sdr.IdEstado = est.IdEstado
    //     WHERE sr.NoSalidaRepuestos = ?
    //     /*GROUP BY 
    //         sr.IdSalidaRepuesto,
    //         sr.NoSalidaRepuestos,
    //         sr.FechaSalida,
    //         sr.Responsable,
    //         p.Nombres,
    //         p.Apellidos,
    //         sr.Observaciones,
    //         sr.UsuarioCreacion,
    //         uc.Nombres,
    //         uc.Apellidos,
    //         sr.FechaCreacion,
    //         mr_max.IdTipoMovimiento;*/
    // `;
    
        const sql = `
        WITH movimiento_max AS (
            SELECT 
                IdDocumentoOrigen,
                MAX(IdTipoMovimiento) AS IdTipoMovimiento
            FROM movimiento_repuesto
            GROUP BY IdDocumentoOrigen
        )
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
            COALESCE(mm.IdTipoMovimiento, 5) AS IdTipoMovimiento,
            JSON_ARRAYAGG(
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
            ) AS Repuestos
        FROM salida_repuesto AS sr
        LEFT JOIN usuario p ON sr.Responsable = p.DocumentoUsuario
        LEFT JOIN usuario uc ON sr.UsuarioCreacion = uc.DocumentoUsuario
        LEFT JOIN movimiento_max mm ON mm.IdDocumentoOrigen = sr.IdSalidaRepuesto
        LEFT JOIN salida_detalle_repuesto sdr ON sdr.IdSalidaRepuesto = sr.IdSalidaRepuesto
        LEFT JOIN repuestos r ON sdr.IdRepuesto = r.IdRepuesto
        LEFT JOIN unidad um ON sdr.IdUnidadDeMedida = um.IdUnidad
        LEFT JOIN estado est ON sdr.IdEstado = est.IdEstado
        WHERE sr.NoSalidaRepuestos = ?
        GROUP BY sr.IdSalidaRepuesto
    `;
    return query(sql, [NoSalidaRepuestos]);
};
module.exports = {
    VisualizarSalidaRepuestosQuery
};