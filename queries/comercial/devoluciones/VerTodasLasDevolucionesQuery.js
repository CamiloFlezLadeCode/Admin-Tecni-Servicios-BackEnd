const { query } = require('../../../config/db');
const { consultaPaginada } = require('../../../utils/paginacion');

// Consulta del listado, separada de su orden para poder reutilizarla en la versión paginada.
const SQL_LISTADO = `
        SELECT DISTINCT
            devo.IdDevolucion AS IdDevolucion,
            devo.NoDevolucion AS NoDevolucion,
            GROUP_CONCAT(DISTINCT remi.NoRemision ORDER BY remi.NoRemision SEPARATOR ', ') AS NoRemision,
            CONCAT(SUBSTRING_INDEX(COALESCE(cliente.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(cliente.Apellidos, ''), ' ', 1)) AS Cliente,
            proyec.Nombre AS Proyecto,
            CONCAT(SUBSTRING_INDEX(COALESCE(usucreacion.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usucreacion.Apellidos, ''), ' ', 1)) AS CreadoPor,
            DATE_FORMAT(devo.FechaCreacion, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaCreacion,
            esta.Estado AS Estado
        FROM
            devoluciones AS devo
        INNER JOIN
            usuario AS cliente ON devo.DocumentoCliente = cliente.DocumentoUsuario
        INNER JOIN
            proyectos AS proyec ON devo.IdProyecto = proyec.IdProyecto
        INNER JOIN
            usuario AS usucreacion ON devo.UsuarioCreacion = usucreacion.DocumentoUsuario
        INNER JOIN
            estado AS esta ON devo.IdEstado = esta.IdEstado
        LEFT JOIN
            detalles_devoluciones AS detadevo ON devo.IdDevolucion = detadevo.IdDevolucion
        LEFT JOIN
            remisiones AS remi ON detadevo.IdRemision = remi.IdRemision
        GROUP BY
            devo.IdDevolucion, 
            devo.NoDevolucion,
            cliente.Nombres,
            cliente.Apellidos,
            proyec.Nombre,
            usucreacion.Nombres,
            usucreacion.Apellidos,
            devo.FechaCreacion,
            esta.Estado
`;

const ORDEN_LISTADO = `CAST(devo.NoDevolucion AS UNSIGNED) DESC, FechaCreacion DESC`;

const VerTodasLasDevolucionesQuery = async () => {
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
const VerTodasLasDevolucionesPaginadoQuery = async (paginacion) => {
    return consultaPaginada({
        sqlBase: SQL_LISTADO,
        orden: `${ORDEN_LISTADO}, devo.IdDevolucion DESC`,
        columnasBusqueda: [
            'NoDevolucion', 'NoRemision', 'Cliente', 'Proyecto', 'CreadoPor',
            // `devo.FechaCreacion` está en el GROUP BY: en HAVING el nombre sería la fecha cruda
            { expresion: "DATE_FORMAT(devo.FechaCreacion, '%W %d/%m/%Y a las %l:%i:%s %p')" },
        ],
        paginacion,
    });
};

module.exports = {
    VerTodasLasDevolucionesQuery,
    VerTodasLasDevolucionesPaginadoQuery
};