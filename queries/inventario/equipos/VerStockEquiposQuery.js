const { query } = require('../../../config/db');
const { consultaPaginada } = require('../../../utils/paginacion');

// Consulta del listado, separada de su orden para poder reutilizarla en la versión paginada.
const SQL_LISTADO = `
        SELECT
            e.IdEquipo AS IdEquipo,
            e.Nombre AS NombreEquipo,
            e.CantidadDisponible AS Cantidad,
            #est.Estado AS Estado,
            CASE
            	WHEN e.CantidadDisponible <= 0 THEN 'No disponible'
				ELSE 'Disponible'
			END AS Estado,
            um.Nombre AS UnidadMedida
        FROM
            equipo AS e
        LEFT JOIN
            estado AS est ON e.IdEstado = est.IdEstado
        LEFT JOIN
            unidad AS um ON e.IdUnidadDeMedida = um.IdUnidad
`;

const ORDEN_LISTADO = `e.Nombre ASC`;

const VerStockEquiposQuery = async () => {
    return query(`${SQL_LISTADO}\n        ORDER BY ${ORDEN_LISTADO}`);
};
/**
 * Versión paginada del listado (ver `utils/paginacion.js`): mismas filas y columnas,
 * con búsqueda en las columnas que muestra la tabla y desempate por clave primaria.
 */
const VerStockEquiposPaginadoQuery = async (paginacion, filtros = {}) => {
    return consultaPaginada({
        sqlBase: SQL_LISTADO,
        orden: `${ORDEN_LISTADO}, e.IdEquipo ASC`,
        columnasBusqueda: ['NombreEquipo'],
        paginacion,
        filtros: [
            filtros.SoloBajoStock
                ? { sql: 'COALESCE(`Cantidad`, 0) <= 5', params: [] }
                : null,
        ],
        fechasEnEspanol: false,
    });
};

module.exports = {
    VerStockEquiposQuery,
    VerStockEquiposPaginadoQuery
};
