const { query } = require('../../../config/db');

const ConsultarSalidasRepuestosQuery = async () => {
    await query(`
        SET lc_time_names = 'es_ES';
    `);
    const sql = `
        SELECT
            sr.NoSalidaRepuestos AS NoSalidaRepuestos,
            DATE_FORMAT(sr.FechaSalida, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaSalida,
            sr.Responsable AS Responsable,
            CONCAT(SUBSTRING_INDEX(COALESCE(usu_responsable.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu_responsable.Apellidos, ''), ' ', 1)) AS NombreResponsable,
            sr.Observaciones AS Observaciones,
            sr.UsuarioCreacion AS UsuarioCreacion,
            CONCAT(SUBSTRING_INDEX(COALESCE(usu_creacion.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu_creacion.Apellidos, ''), ' ', 1)) AS CreadoPor,
            DATE_FORMAT(sr.FechaCreacion, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaCreacion,
            (
                SELECT tm.Nombre
                FROM movimiento_repuesto mr
                INNER JOIN cat_tipos_movimiento_repuesto tm ON mr.IdTipoMovimiento = tm.IdTipoMovimiento
                WHERE mr.IdDocumentoOrigen = sr.IdSalidaRepuesto
                ORDER BY mr.Fecha DESC, mr.IdMovimientoRepuesto DESC
                LIMIT 1
            ) AS TipoMovimiento
        FROM
            salida_repuesto AS sr
        INNER JOIN
            usuario AS usu_responsable ON sr.Responsable = usu_responsable.DocumentoUsuario
        INNER JOIN
            usuario AS usu_creacion ON sr.UsuarioCreacion = usu_creacion.DocumentoUsuario
        ORDER BY
            sr.NoSalidaRepuestos DESC
    `;
    return query(sql);
};
module.exports = {
    ConsultarSalidasRepuestosQuery
};