const { query } = require('../../../config/db');
const { consultaPaginada } = require('../../../utils/paginacion');

// Consulta del listado, separada de su orden para poder reutilizarla en la versión paginada.
const SQL_LISTADO = `
        SELECT	
            remi.IdRemision AS IdRemision,
            remi.NoRemision AS NoRemision,
            CONCAT(SUBSTRING_INDEX(COALESCE(cliente.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(cliente.Apellidos, ''), ' ', 1)) AS Cliente,
            proyec.Nombre AS Proyecto,
            CONCAT(SUBSTRING_INDEX(COALESCE(usucreacion.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usucreacion.Apellidos, ''), ' ', 1)) AS CreadoPor,
            DATE_FORMAT(remi.FechaCreacion, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaCreacion,    
            remi.ObservacionesEmpresa AS ObservacionesInternasEmpresa,
            esta.Estado AS EstadoRemision
            
        FROM
            remisiones AS remi
        INNER JOIN
            usuario AS cliente ON remi.DocumentoCliente = cliente.DocumentoUsuario
        INNER JOIN
            proyectos AS proyec ON remi.IdProyecto = proyec.IdProyecto
        INNER JOIN
            usuario AS usucreacion ON remi.UsuarioCreacion = usucreacion.DocumentoUsuario
        INNER JOIN
            estado AS esta ON remi.IdEstado = esta.IdEstado
`;

const ORDEN_LISTADO = `remi.FechaCreacion DESC`;

const ConsultarRemisionesQuery = async () => {
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
const ConsultarRemisionesPaginadoQuery = async (paginacion) => {
    return consultaPaginada({
        sqlBase: SQL_LISTADO,
        orden: `${ORDEN_LISTADO}, remi.IdRemision DESC`,
        columnasBusqueda: ['NoRemision', 'Cliente', 'Proyecto', 'CreadoPor', 'FechaCreacion', 'ObservacionesInternasEmpresa'],
        paginacion,
    });
};

module.exports = {
    ConsultarRemisionesQuery,
    ConsultarRemisionesPaginadoQuery
};