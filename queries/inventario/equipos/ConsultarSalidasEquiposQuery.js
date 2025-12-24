const { query } = require('../../../config/db');

const ConsultarSalidasEquiposQuery = async () => {
    await query(`
        SET lc_time_names = 'es_ES';
    `);
    const sql = `
        SELECT
            se.NoSalidaEquipo AS NoSalidaEquipos,
            DATE_FORMAT(se.FechaSalida, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaSalida,
            se.Responsable AS Responsable,
            CONCAT(SUBSTRING_INDEX(COALESCE(usu_responsable.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu_responsable.Apellidos, ''), ' ', 1)) AS NombreResponsable,
            se.Observaciones AS Observaciones,
            se.UsuarioCreacion AS UsuarioCreacion,
            CONCAT(SUBSTRING_INDEX(COALESCE(usu_creacion.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu_creacion.Apellidos, ''), ' ', 1)) AS CreadoPor,
            DATE_FORMAT(se.FechaCreacion, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaCreacion,
            (
                SELECT tm.Nombre
                FROM movimiento_equipo me
                INNER JOIN cat_tipos_movimiento_equipo tm ON me.IdTipoMovimiento = tm.IdTipoMovimiento
                WHERE me.IdDocumentoOrigen = se.IdSalidaEquipo
                ORDER BY me.Fecha DESC, me.IdMovimientoEquipo DESC
                LIMIT 1
            ) AS TipoMovimiento
        FROM
            salida_equipo AS se
        INNER JOIN
            usuario AS usu_responsable ON se.Responsable = usu_responsable.DocumentoUsuario COLLATE utf8mb4_0900_ai_ci
        INNER JOIN
            usuario AS usu_creacion ON se.UsuarioCreacion = usu_creacion.DocumentoUsuario COLLATE utf8mb4_0900_ai_ci
        ORDER BY
            se.NoSalidaEquipo DESC
    `;
    return query(sql);
};
module.exports = {
    ConsultarSalidasEquiposQuery
};
