const { query } = require('../../../config/db');
const { consultaPaginada } = require('../../../utils/paginacion');

// Consulta del listado, separada de su orden para poder reutilizarla en la versión paginada.
const SQL_LISTADO = `
        SELECT
            rep.IdRepuesto AS IdRepuesto,
            rep.Nombre AS NombreRepuesto,
            rep.CantidadDisponible AS CantidadDisponible,
            #est.Estado AS Estado
            CASE 
            	WHEN rep.CantidadDisponible <= 0 THEN 'No disponible'
                ELSE 'Disponible'
			END AS Estado   
        FROM
            repuestos AS rep
        LEFT JOIN
            estado AS est ON rep.IdEstado = est.IdEstado
`;

const ORDEN_LISTADO = `rep.Nombre ASC`;

const VerStockRepuestosQuery = async () => {
    return query(`${SQL_LISTADO}\n        ORDER BY ${ORDEN_LISTADO}`);
};
/**
 * Versión paginada del listado (ver `utils/paginacion.js`): mismas filas y columnas,
 * con búsqueda en las columnas que muestra la tabla y desempate por clave primaria.
 */
const VerStockRepuestosPaginadoQuery = async (paginacion, filtros = {}) => {
    return consultaPaginada({
        sqlBase: SQL_LISTADO,
        orden: `${ORDEN_LISTADO}, rep.IdRepuesto ASC`,
        columnasBusqueda: ['NombreRepuesto'],
        paginacion,
        filtros: [
            filtros.SoloBajoStock
                ? { sql: 'COALESCE(`CantidadDisponible`, 0) <= 5', params: [] }
                : null,
        ],
        fechasEnEspanol: false,
    });
};

module.exports = {
    VerStockRepuestosQuery,
    VerStockRepuestosPaginadoQuery
};