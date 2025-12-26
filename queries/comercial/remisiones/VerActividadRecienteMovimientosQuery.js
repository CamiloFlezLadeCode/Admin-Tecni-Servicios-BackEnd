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
            FechaCreacion
        FROM (
            SELECT
                'REMISION' AS TipoMovimiento,
                remi.IdRemision AS IdMovimiento,
                remi.NoRemision AS NoMovimiento,
                CONCAT(SUBSTRING_INDEX(COALESCE(cliente.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(cliente.Apellidos, ''), ' ', 1)) AS Cliente,
                proyec.Nombre AS Proyecto,
                CONCAT(SUBSTRING_INDEX(COALESCE(usucreacion.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usucreacion.Apellidos, ''), ' ', 1)) AS CreadoPor,
                esta.Estado AS Estado,
                remi.FechaCreacion AS FechaCreacion
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
                devo.FechaCreacion AS FechaCreacion
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
                os.FechaCreacion AS FechaCreacion
            FROM ordenes_de_servicio AS os
            INNER JOIN usuario AS cliente ON os.DocumentoCliente = cliente.DocumentoUsuario
            INNER JOIN proyectos AS proyec ON os.IdProyecto = proyec.IdProyecto
            INNER JOIN usuario AS usucreacion ON os.UsuarioCreacion = usucreacion.DocumentoUsuario
            INNER JOIN estado AS esta ON os.IdEstado = esta.IdEstado
        ) AS movimientos
        ORDER BY FechaCreacion DESC
        LIMIT ?
    `;

    return query(sql, [Limite]);
};

module.exports = {
    VerActividadRecienteMovimientosQuery
};

