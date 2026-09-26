const { query } = require('../../../config/db');
const { consultaPaginada } = require('../../../utils/paginacion');

// Consulta del listado, separada de su orden para poder reutilizarla en la versión paginada.
const SQL_LISTADO = `
        SELECT	
            repu.IdRepuesto AS IdRepuesto,
            repu.Nombre AS NombreRepuesto,
            repu.Cantidad AS CantidadRepuesto,   
            repu.CantidadDisponible AS CantidadDisponibleRepuesto,
            #CONCAT(COALESCE(usu.Nombres, ''), ' ', SUBSTRING_INDEX(COALESCE(usu.Apellidos, ''), ' ', 1)) AS UsuarioCreacion,
            #IFNULL(CONCAT(COALESCE(usu.Nombres, ''), ' ', SUBSTRING_INDEX(COALESCE(usu.Apellidos, ''), ' ', 1)), 'Usuario desconocido') AS UsuarioCreacion,
            IFNULL(CONCAT(COALESCE(usu.Nombres, ''), ' ', SUBSTRING_INDEX(COALESCE(usu.Apellidos, NULL), ' ', 1)), 'Sin usuario de creación') AS UsuarioCreacion,
            CONCAT(DAYNAME(repu.FechaCreacion), ' ', DATE_FORMAT(repu.FechaCreacion, '%d/%m/%Y a las %l:%i:%s %p')) AS FechaCreacion,
            esta.Estado AS EstadoRepuesto
        FROM	
            repuestos AS repu
        LEFT JOIN	
            usuario AS usu ON repu.UsuarioCreacion = usu.DocumentoUsuario
        LEFT JOIN	
            estado AS esta ON repu.IdEstado = esta.IdEstado
`;

const ORDEN_LISTADO = `repu.Nombre ASC`;

const ConsultarRepuestosQuery = async () => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    return query(`${SQL_LISTADO}\n        ORDER BY ${ORDEN_LISTADO}`);
};
/**
 * Versión paginada del listado (ver `utils/paginacion.js`): mismas filas y columnas,
 * con búsqueda en las columnas que muestra la tabla y desempate por clave primaria.
 */
const ConsultarRepuestosPaginadoQuery = async (paginacion) => {
    return consultaPaginada({
        sqlBase: SQL_LISTADO,
        orden: `${ORDEN_LISTADO}, repu.IdRepuesto ASC`,
        columnasBusqueda: ['IdRepuesto', 'NombreRepuesto', 'CantidadDisponibleRepuesto', 'UsuarioCreacion', 'FechaCreacion'],
        paginacion,
    });
};

module.exports = {
    ConsultarRepuestosQuery,
    ConsultarRepuestosPaginadoQuery
};