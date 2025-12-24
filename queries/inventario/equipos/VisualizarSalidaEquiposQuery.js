const { query } = require('../../../config/db');

const VisualizarSalidaEquiposQuery = async (NoSalidaEquipos) => {
    const sql = `
        WITH movimiento_max AS (
            SELECT 
                IdDocumentoOrigen,
                MAX(IdTipoMovimiento) AS IdTipoMovimiento
            FROM movimiento_equipo
            WHERE IdTipoMovimiento IN (SELECT IdTipoMovimiento FROM cat_tipos_movimiento_equipo)
            GROUP BY IdDocumentoOrigen
        )
        SELECT
            se.NoSalidaEquipo AS NoSalidaEquipos,
            se.FechaSalida,
            se.Responsable AS DocumentoResponsable,
            se.Responsable,
            CONCAT(p.Nombres, ' ', p.Apellidos) AS NombreResponsable,
            se.Observaciones,
            se.UsuarioCreacion,
            CONCAT(uc.Nombres, ' ', uc.Apellidos) AS CreadoPor,
            se.FechaCreacion,
            COALESCE(mm.IdTipoMovimiento, 20) AS IdTipoMovimiento,
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'IdEquipo', sde.IdEquipo,
                        'Equipo', e.Nombre,
                        'Cantidad', sde.Cantidad,
                        'IdUnidadDeMedida', sde.IdUnidadDeMedida,
                        'UnidadMedida', um.Nombre,
                        'IdEstado', sde.IdEstado,
                        'Estado', est.Estado,
                        'Observaciones', sde.Observaciones
                    )
                )
                FROM salida_detalle_equipo sde
                LEFT JOIN equipo e ON sde.IdEquipo = e.IdEquipo
                LEFT JOIN unidad um ON sde.IdUnidadDeMedida = um.IdUnidad
                LEFT JOIN estado est ON sde.IdEstado = est.IdEstado
                WHERE sde.IdSalidaEquipo = se.IdSalidaEquipo
            ) AS Equipos
        FROM salida_equipo AS se
        LEFT JOIN usuario p ON se.Responsable = p.DocumentoUsuario COLLATE utf8mb4_0900_ai_ci
        LEFT JOIN usuario uc ON se.UsuarioCreacion = uc.DocumentoUsuario COLLATE utf8mb4_0900_ai_ci
        LEFT JOIN movimiento_max mm ON mm.IdDocumentoOrigen = se.IdSalidaEquipo
        WHERE se.NoSalidaEquipo = ?
    `;
    return query(sql, [NoSalidaEquipos]);
};

module.exports = {
    VisualizarSalidaEquiposQuery
};
