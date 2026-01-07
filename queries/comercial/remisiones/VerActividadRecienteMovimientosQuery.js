const { query } = require('../../../config/db');

const VerActividadRecienteMovimientosQuery = async ({ Limite }) => {
    const sql = `
        SELECT
            TipoMovimiento,
            IdMovimiento,
            NoMovimiento,
            Cliente,
            Proyecto,
            CreadoPor,
            Estado,
            FechaCreacionFormateada AS FechaCreacion
        FROM (
            SELECT
                'REMISION' AS TipoMovimiento,
                remi.IdRemision AS IdMovimiento,
                remi.NoRemision AS NoMovimiento,
                CONCAT(SUBSTRING_INDEX(COALESCE(cliente.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(cliente.Apellidos, ''), ' ', 1)) AS Cliente,
                proyec.Nombre AS Proyecto,
                CONCAT(SUBSTRING_INDEX(COALESCE(usucreacion.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usucreacion.Apellidos, ''), ' ', 1)) AS CreadoPor,
                esta.Estado AS Estado,
                remi.FechaCreacion AS FechaOrdenar,
                DATE_FORMAT(remi.FechaCreacion, '%d/%m/%Y %l:%i %p') AS FechaCreacionFormateada
            FROM remisiones AS remi
            INNER JOIN usuario AS cliente ON remi.DocumentoCliente = cliente.DocumentoUsuario
            INNER JOIN proyectos AS proyec ON remi.IdProyecto = proyec.IdProyecto
            INNER JOIN usuario AS usucreacion ON remi.UsuarioCreacion = usucreacion.DocumentoUsuario
            INNER JOIN estado AS esta ON remi.IdEstado = esta.IdEstado

            UNION ALL

            SELECT
                'DEVOLUCION' AS TipoMovimiento,
                devo.IdDevolucion AS IdMovimiento,
                devo.NoDevolucion AS NoMovimiento,
                CONCAT(SUBSTRING_INDEX(COALESCE(cliente.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(cliente.Apellidos, ''), ' ', 1)) AS Cliente,
                proyec.Nombre AS Proyecto,
                CONCAT(SUBSTRING_INDEX(COALESCE(usucreacion.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usucreacion.Apellidos, ''), ' ', 1)) AS CreadoPor,
                esta.Estado AS Estado,
                devo.FechaCreacion AS FechaOrdenar,
                DATE_FORMAT(devo.FechaCreacion, '%d/%m/%Y %l:%i %p') AS FechaCreacionFormateada
            FROM devoluciones AS devo
            INNER JOIN usuario AS cliente ON devo.DocumentoCliente = cliente.DocumentoUsuario
            INNER JOIN proyectos AS proyec ON devo.IdProyecto = proyec.IdProyecto
            INNER JOIN usuario AS usucreacion ON devo.UsuarioCreacion = usucreacion.DocumentoUsuario
            INNER JOIN estado AS esta ON devo.IdEstado = esta.IdEstado

            UNION ALL

            SELECT
                'ORDEN_DE_SERVICIO' AS TipoMovimiento,
                os.IdOrdenDeServicio AS IdMovimiento,
                os.NoOrdenDeServicio AS NoMovimiento,
                CONCAT(SUBSTRING_INDEX(COALESCE(cliente.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(cliente.Apellidos, ''), ' ', 1)) AS Cliente,
                proyec.Nombre AS Proyecto,
                CONCAT(SUBSTRING_INDEX(COALESCE(usucreacion.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usucreacion.Apellidos, ''), ' ', 1)) AS CreadoPor,
                esta.Estado AS Estado,
                os.FechaCreacion AS FechaOrdenar,
                DATE_FORMAT(os.FechaCreacion, '%d/%m/%Y %l:%i %p') AS FechaCreacionFormateada
            FROM ordenes_de_servicio AS os
            INNER JOIN usuario AS cliente ON os.DocumentoCliente = cliente.DocumentoUsuario
            INNER JOIN proyectos AS proyec ON os.IdProyecto = proyec.IdProyecto
            INNER JOIN usuario AS usucreacion ON os.UsuarioCreacion = usucreacion.DocumentoUsuario
            INNER JOIN estado AS esta ON os.IdEstado = esta.IdEstado
        ) AS movimientos
        ORDER BY FechaOrdenar DESC
        LIMIT ?
    `;

    return query(sql, [Limite]);
};

module.exports = {
    VerActividadRecienteMovimientosQuery
};

