const { query } = require('../../../config/db');
const { consultaPaginada } = require('../../../utils/paginacion');

// Consulta del listado, separada de su orden para poder reutilizarla en la versión paginada.
const SQL_LISTADO = `
        -- Consulta principal
        SELECT 
            usu.IdUsuario AS IdUsuario,
            CONCAT(COALESCE(usu.Nombres, ''), ' ', COALESCE(usu.Apellidos, '')) AS Nombre,
            tipodocumento.Codigo AS TipoDocumento,
            usu.DocumentoUsuario AS Documento,
            usu.Correo AS Correo,
            usu.Direccion AS Direccion,
            usu.Celular AS Celular,
            CONCAT(SUBSTRING_INDEX(COALESCE(usu2.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu2.Apellidos, ''), ' ', 1)) AS UsuarioCreacion,
            DATE_FORMAT(usu.FechaCreacion, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaCreacion, 
            estado.Estado AS Estado,
            rol.Rol AS Rol
        FROM 
            usuario usu
        INNER JOIN
            usuario usu2 ON usu.UsuarioCreacion = usu2.DocumentoUsuario
        INNER JOIN
            tipodocumento ON usu.TipoDocumento = tipodocumento.IdTipoDocumento
        INNER JOIN
            estado ON usu.IdEstado = estado.IdEstado
        INNER JOIN	
            usuario_roles usurol ON usu.DocumentoUsuario = usurol.DocumentoUsuario
        INNER JOIN
            roles rol ON usurol.IdRol = rol.IdRol
        WHERE	
            rol.Rol = 'Mecánico'
`;

const ORDEN_LISTADO = `usu.Nombres ASC, usu.Apellidos ASC`;

const ConsultarMecanicosQuery = async () => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);

    // const explain = await query(`EXPLAIN ${sql}`);
    // console.log(explain);
    return query(`${SQL_LISTADO}\n        ORDER BY ${ORDEN_LISTADO}`);
};
/**
 * Versión paginada del listado (ver `utils/paginacion.js`): mismas filas y columnas,
 * con búsqueda en las columnas que muestra la tabla y desempate por clave primaria.
 */
const ConsultarMecanicosPaginadoQuery = async (paginacion) => {
    return consultaPaginada({
        sqlBase: SQL_LISTADO,
        orden: `${ORDEN_LISTADO}, usu.IdUsuario ASC`,
        columnasBusqueda: ['Nombre', 'Documento'],
        paginacion,
    });
};

module.exports = {
    ConsultarMecanicosQuery,
    ConsultarMecanicosPaginadoQuery
};