const { query } = require('../../../config/db');
const { consultaPaginada } = require('../../../utils/paginacion');

// Consulta del listado, separada de su orden para poder reutilizarla en la versión paginada.
const SQL_LISTADO = `
        SELECT 
            vehi.IdVehiculo AS IdVehiculo,
            vehi.Placa AS Placa,
            CONCAT(SUBSTRING_INDEX(COALESCE(usu.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu.Apellidos, ''), ' ', 1)) 			  AS UsuarioCreacion,
            DATE_FORMAT(vehi.FechaCreacion, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaCreacion,
            esta.Estado
        FROM
            vehiculos AS vehi
        INNER JOIN
            estado AS esta ON vehi.IdEstado = esta.IdEstado
        LEFT JOIN
            usuario AS usu ON vehi.UsuarioCreacion = usu.DocumentoUsuario
`;

const ORDEN_LISTADO = `vehi.Placa ASC`;

const ConsultarVehiculosQuery = async () => {
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
const ConsultarVehiculosPaginadoQuery = async (paginacion) => {
    return consultaPaginada({
        sqlBase: SQL_LISTADO,
        orden: `${ORDEN_LISTADO}, vehi.IdVehiculo ASC`,
        columnasBusqueda: ['IdVehiculo', 'Placa', 'UsuarioCreacion', 'FechaCreacion'],
        paginacion,
    });
};

module.exports = {
    ConsultarVehiculosQuery,
    ConsultarVehiculosPaginadoQuery
};