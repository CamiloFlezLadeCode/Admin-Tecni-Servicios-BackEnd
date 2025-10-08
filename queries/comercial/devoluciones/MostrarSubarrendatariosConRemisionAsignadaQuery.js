const { query } = require('../../../config/db');

const MostrarSubarrendatariosConRemisionAsignadaQuery = async (DatosConsulta) => {
    // const sql = `
    //     SELECT	
    //         usu.DocumentoUsuario AS DocumentoSubarrendatario,
    //         CONCAT(COALESCE(usu.Nombres, ''), ' ', COALESCE(usu.Apellidos, '')) AS	Subarrendatario
    //     FROM
    //         remisiones AS remi 
    //     INNER JOIN
    //         detalles_remisiones AS detaremi ON remi.IdRemision = detaremi.IdRemision
    //     LEFT JOIN
    //         usuario AS usu ON detaremi.DocumentoSubarrendatario = usu.DocumentoUsuario
    //     RIGHT JOIN
    //         proyectos AS proye ON remi.IdProyecto = proye.IdProyecto
    //     WHERE
    //         (remi.DocumentoCliente = ?) AND (remi.IdProyecto = ?)
    //     GROUP BY
    //         usu.DocumentoUsuario
    //     ORDER BY
    //         CONCAT(COALESCE(usu.Nombres, ''), ' ', COALESCE(usu.Apellidos, '')) ASC
    // `;
    // const sql = `
    //     SELECT DISTINCT
    //         usu.DocumentoUsuario AS DocumentoSubarrendatario,
    //         CONCAT(
    //             COALESCE(usu.Nombres, ''), 
    //             ' ', 
    //             COALESCE(usu.Apellidos, '')
    //         ) AS Subarrendatario
    //     FROM remisiones AS remi
    //     INNER JOIN detalles_remisiones AS detaremi 
    //         ON remi.IdRemision = detaremi.IdRemision
    //     INNER JOIN proyectos AS proye 
    //         ON remi.IdProyecto = proye.IdProyecto
    //     LEFT JOIN usuario AS usu 
    //         ON detaremi.DocumentoSubarrendatario = usu.DocumentoUsuario
    //     WHERE 
    //         remi.DocumentoCliente = ? 
    //         AND remi.IdProyecto = ?
    //         AND usu.DocumentoUsuario IS NOT NULL
    //     ORDER BY 
    //         Subarrendatario ASC;

    // `;

    const sql = `
        SELECT 
            usu.DocumentoUsuario AS DocumentoSubarrendatario,
            CONCAT(
                COALESCE(usu.Nombres, ''), 
                ' ', 
                COALESCE(usu.Apellidos, '')
            ) AS Subarrendatario,
            SUM(detaremi.Cantidad) AS CantidadAlquilada,
            SUM(COALESCE(detadevo.CantidadDevuelta, 0)) AS CantidadDevuelta,
            (SUM(detaremi.Cantidad) - SUM(COALESCE(detadevo.CantidadDevuelta, 0))) AS Total
        FROM remisiones AS remi
        INNER JOIN detalles_remisiones AS detaremi 
            ON remi.IdRemision = detaremi.IdRemision
        INNER JOIN proyectos AS proye 
            ON remi.IdProyecto = proye.IdProyecto
        INNER JOIN usuario AS usu 
            ON detaremi.DocumentoSubarrendatario = usu.DocumentoUsuario
        LEFT JOIN (
            SELECT IdRemision, IdEquipo, SUM(Cantidad) AS CantidadDevuelta
            FROM detalles_devoluciones
            GROUP BY IdRemision, IdEquipo
        ) AS detadevo
            ON detaremi.IdRemision = detadevo.IdRemision
            AND detaremi.IdEquipo = detadevo.IdEquipo
        WHERE 
            remi.DocumentoCliente = ?
            AND remi.IdProyecto = ?
        GROUP BY 
            usu.DocumentoUsuario, usu.Nombres, usu.Apellidos
        HAVING 
           (SUM(detaremi.Cantidad) - SUM(COALESCE(detadevo.CantidadDevuelta, 0))) > ?
        ORDER BY 
            Subarrendatario ASC;
    `

    const CantidadPendientePorDevolver = 0;
    return query(sql, [
        DatosConsulta.DocumentoCliente,
        DatosConsulta.IdProyecto,
        CantidadPendientePorDevolver
    ]);
};
module.exports = {
    MostrarSubarrendatariosConRemisionAsignadaQuery
};