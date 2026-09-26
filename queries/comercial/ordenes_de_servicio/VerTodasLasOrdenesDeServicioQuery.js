const { query } = require('../../../config/db');
const { consultaPaginada } = require('../../../utils/paginacion');

// Consulta del listado, separada de su orden para poder reutilizarla en la versión paginada.
const SQL_LISTADO = `
        SELECT
            orden.IdOrdenDeServicio AS IdOrdenDeServicio,
            orden.NoOrdenDeServicio AS NoOrdenDeServicio,
            CONCAT(SUBSTRING_INDEX(COALESCE(cliente.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(cliente.Apellidos, ''), ' ', 1)) AS Cliente,
            proyec.Nombre AS Proyecto,
            CONCAT(SUBSTRING_INDEX(COALESCE(mecanico.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(mecanico.Apellidos, ''), ' ', 1)) AS Mecanico,
                CONCAT(SUBSTRING_INDEX(COALESCE(usucreacion.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usucreacion.Apellidos, ''), ' ', 1)) AS CreadoPor,
                DATE_FORMAT(orden.FechaCreacion, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaCreacion,
                esta.Estado AS EstadoOrdenDeServicio
        FROM
            ordenes_de_servicio AS orden
        INNER JOIN
            usuario AS cliente ON orden.DocumentoCliente = cliente.DocumentoUsuario
        INNER JOIN
            proyectos AS proyec ON orden.IdProyecto = proyec.IdProyecto
        INNER JOIN
            usuario AS mecanico ON orden.DocumentoMecanico = mecanico.DocumentoUsuario
        INNER JOIN
            usuario AS usucreacion ON orden.UsuarioCreacion = usucreacion.DocumentoUsuario
        INNER JOIN
            estado AS esta ON orden.IdEstado = esta.IdEstado
`;

const ORDEN_LISTADO = `orden.FechaCreacion DESC`;

const VerTodasLasOrdenesDeServicioQuery = async () => {
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
const VerTodasLasOrdenesDeServicioPaginadoQuery = async (paginacion) => {
    return consultaPaginada({
        sqlBase: SQL_LISTADO,
        orden: `${ORDEN_LISTADO}, orden.IdOrdenDeServicio DESC`,
        columnasBusqueda: ['NoOrdenDeServicio', 'Cliente', 'Proyecto', 'Mecanico', 'FechaCreacion', 'CreadoPor'],
        paginacion,
    });
};

module.exports = {
    VerTodasLasOrdenesDeServicioQuery,
    VerTodasLasOrdenesDeServicioPaginadoQuery
};