// const { query } = require('../../../config/db');

// const VerTodasLasDevolucionesQuery = async () => {
//     await query(`
//         -- Ejecutar esto por separado antes del SELECT
//         SET lc_time_names = 'es_ES';
//     `);
//     const sql = `
//         SELECT
//             devo.IdDevolucion AS IdDevolucion,
//             devo.NoDevolucion AS NoDevolucion,
//             #devo.IdRemision AS IdRemision,    
//             remi.NoRemision AS NoRemision,
//             CONCAT(SUBSTRING_INDEX(COALESCE(cliente.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(cliente.Apellidos, ''), ' ', 1)) AS Cliente,
//             proyec.Nombre AS Proyecto,
//             CONCAT(SUBSTRING_INDEX(COALESCE(usucreacion.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usucreacion.Apellidos, ''), ' ', 1)) AS CreadoPor,
//             DATE_FORMAT(devo.FechaCreacion, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaCreacion,
//             esta.Estado AS Estado
//         FROM
//             devoluciones AS devo
//         INNER JOIN
//             usuario AS cliente ON devo.DocumentoCliente = cliente.DocumentoUsuario
//         INNER JOIN
//             proyectos AS proyec ON devo.IdProyecto = proyec.IdProyecto
//         INNER JOIN
//             usuario AS usucreacion ON devo.UsuarioCreacion = usucreacion.DocumentoUsuario
//         INNER JOIN
//             estado AS esta ON devo.IdEstado = esta.IdEstado
//         #INNER JOIN
//             #remisiones AS remi ON devo.IdRemision = remi.IdRemision
//         INNER JOIN
//             detalles_devoluciones AS detadevo ON devo.IdDevolucion = detadevo.IdDevolucion
//         INNER JOIN
//             remisiones AS remi ON detadevo.IdRemision = remi.IdRemision
//         ORDER BY
//             devo.FechaCreacion DESC
//     `;
//     return query(sql);
// };
// module.exports = {
//     VerTodasLasDevolucionesQuery
// };






const { query } = require('../../../config/db');

const VerTodasLasDevolucionesQuery = async () => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    const sql = `
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
        ORDER BY
            devo.FechaCreacion DESC
    `;
    return query(sql);
};

module.exports = {
    VerTodasLasDevolucionesQuery
};