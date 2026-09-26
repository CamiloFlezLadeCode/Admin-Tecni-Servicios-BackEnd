const { query } = require('../../../config/db');
const { consultaPaginada } = require('../../../utils/paginacion');

// Consulta del listado, separada de su orden para poder reutilizarla en la versión paginada.
const SQL_LISTADO = `
        SELECT	
            #entra_equi.IdEntradaEquipo AS IdEntradaEquipo,
            entra_equi.NoEntradaEquipos AS NoEntradaEquipos,
            DATE_FORMAT(entra_equi.FechaEntrada, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaEntrada,
            CONCAT(SUBSTRING_INDEX(COALESCE(usu_responsable.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu_responsable.Apellidos, ''), ' ', 1)) AS NombreResponsable,
            entra_equi.Observaciones AS Observaciones,
            CONCAT(SUBSTRING_INDEX(COALESCE(usu_creacion.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu_creacion.Apellidos, ''), ' ', 1)) AS CreadoPor,
            DATE_FORMAT(entra_equi.FechaCreacion, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaCreacion
        FROM
            entrada_equipo AS entra_equi
        INNER JOIN
            usuario AS usu_responsable ON entra_equi.Responsable = usu_responsable.DocumentoUsuario
        INNER JOIN
            usuario AS usu_creacion ON entra_equi.UsuarioCreacion = usu_creacion.DocumentoUsuario
`;

const ORDEN_LISTADO = `entra_equi.NoEntradaEquipos DESC`;

const ConsultarEntradasDeEquiposQuery = async () => {
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
const ConsultarEntradasDeEquiposPaginadoQuery = async (paginacion) => {
    return consultaPaginada({
        sqlBase: SQL_LISTADO,
        orden: `${ORDEN_LISTADO}, entra_equi.IdEntradaEquipo DESC`,
        columnasBusqueda: ['NoEntradaEquipos', 'FechaEntrada', 'NombreResponsable', 'CreadoPor', 'FechaCreacion'],
        paginacion,
    });
};

module.exports = {
    ConsultarEntradasDeEquiposQuery,
    ConsultarEntradasDeEquiposPaginadoQuery
};