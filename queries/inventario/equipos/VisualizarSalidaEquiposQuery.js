const { query } = require('../../../config/db');

const VisualizarSalidaEquiposQuery = async (NoSalidaEquipos) => {
    // El tipo de movimiento no se guarda en salida_equipo, sólo en movimiento_equipo.
    // IdDocumentoOrigen por sí solo NO identifica la salida: remisiones, devoluciones
    // y entradas escriben ahí su propio id, así que los ids se cruzan. Se filtra
    // además por dirección y por DocumentoReferencia (= NoSalidaEquipo).
    const sql = `
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
            (
                SELECT me.IdTipoMovimiento
                FROM movimiento_equipo me
                WHERE me.IdDocumentoOrigen = se.IdSalidaEquipo
                  AND me.DocumentoReferencia = se.NoSalidaEquipo
                  AND me.Direccion = 'SALIDA'
                ORDER BY me.IdMovimientoEquipo DESC
                LIMIT 1
            ) AS IdTipoMovimiento,
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
        WHERE se.NoSalidaEquipo = ?
    `;
    return query(sql, [NoSalidaEquipos]);
};

module.exports = {
    VisualizarSalidaEquiposQuery
};
