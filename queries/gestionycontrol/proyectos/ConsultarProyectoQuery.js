const { query } = require('../../../config/db');
const { consultaPaginada } = require('../../../utils/paginacion');

// Consulta del listado, separada de su orden para poder reutilizarla en la versión paginada.
const SQL_LISTADO = `
        SELECT	
            proye.IdProyecto AS IdProyecto,
            proye.Nombre AS NombreProyecto,
            #CONCAT(SUBSTRING_INDEX(COALESCE(usu.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu.Apellidos, ''), ' ', 1) ) AS Cliente,
            CONCAT(COALESCE(usu.Nombres, ''), ' ', SUBSTRING_INDEX(COALESCE(usu.Apellidos, ''), ' ', 1)) AS Cliente,

            proye.Direccion AS DireccionProyecto,
            CONCAT(SUBSTRING_INDEX(COALESCE(usu2.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu2.Apellidos, ''), ' ', 1) ) AS UsuarioCreacion,
            CONCAT(DAYNAME(proye.FechaCreacion), ' ', DATE_FORMAT(proye.FechaCreacion, '%d/%m/%Y a las %l:%i:%s %p')) AS FechaCreacion,
            esta.Estado AS EstadoProyecto

        FROM	
            proyectos AS proye
        INNER JOIN	
            usuario AS usu ON proye.DocumentoCliente = usu.DocumentoUsuario
        INNER JOIN
            usuario AS usu2 ON proye.UsuarioCreacion = usu2.DocumentoUsuario
        INNER JOIN
            estado AS esta ON proye.IdEstado = esta.IdEstado
`;

const ORDEN_LISTADO = `proye.Nombre ASC`;

const ConsultarProyectosQuery = async () => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    return await query(`${SQL_LISTADO}\n        ORDER BY ${ORDEN_LISTADO}`);
};
/**
 * Versión paginada del listado (ver `utils/paginacion.js`): mismas filas y columnas,
 * con búsqueda en las columnas que muestra la tabla y desempate por clave primaria.
 */
const ConsultarProyectosPaginadoQuery = async (paginacion) => {
    return consultaPaginada({
        sqlBase: SQL_LISTADO,
        orden: `${ORDEN_LISTADO}, proye.IdProyecto ASC`,
        columnasBusqueda: ['NombreProyecto', 'Cliente', 'DireccionProyecto', 'UsuarioCreacion', 'FechaCreacion'],
        paginacion,
    });
};

module.exports = {
    ConsultarProyectosQuery,
    ConsultarProyectosPaginadoQuery
};