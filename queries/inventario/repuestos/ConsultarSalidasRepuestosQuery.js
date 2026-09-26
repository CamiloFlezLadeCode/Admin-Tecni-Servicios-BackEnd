const { query } = require('../../../config/db');
const { consultaPaginada } = require('../../../utils/paginacion');

// Consulta del listado, separada de su orden para poder reutilizarla en la versión paginada.
const SQL_LISTADO = `
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
`;

const ORDEN_LISTADO = `sr.NoSalidaRepuestos DESC`;

const ConsultarSalidasRepuestosQuery = async () => {
    await query(`
        SET lc_time_names = 'es_ES';
    `);
    return query(`${SQL_LISTADO}\n        ORDER BY ${ORDEN_LISTADO}`);
};
/**
 * Versión paginada del listado (ver `utils/paginacion.js`): mismas filas y columnas,
 * con búsqueda en las columnas que muestra la tabla y desempate por clave primaria.
 */
const ConsultarSalidasRepuestosPaginadoQuery = async (paginacion) => {
    return consultaPaginada({
        sqlBase: SQL_LISTADO,
        orden: `${ORDEN_LISTADO}, sr.IdSalidaRepuesto DESC`,
        columnasBusqueda: ['NoSalidaRepuestos', 'FechaSalida', 'NombreResponsable', 'TipoMovimiento', 'CreadoPor', 'FechaCreacion'],
        paginacion,
    });
};

module.exports = {
    ConsultarSalidasRepuestosQuery,
    ConsultarSalidasRepuestosPaginadoQuery
};