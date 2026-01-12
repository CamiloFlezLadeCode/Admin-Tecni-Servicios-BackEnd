const { query } = require('../../../config/db');

const InformeClienteEquiposEnObraQuery = async ({ DocumentoCliente, IdProyecto }) => {
    const params = [DocumentoCliente];

    const filtroProyecto = IdProyecto ? ' AND p.IdProyecto = ? ' : '';
    if (IdProyecto) params.push(IdProyecto);

    const sql = `
        SELECT
            t.DocumentoCliente,
            t.IdProyecto,
            t.Proyecto,
            t.DireccionProyecto,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'IdEquipo', t.IdEquipo,
                    'Equipo', t.Equipo,
                    'Categoria', t.Categoria,
                    'CantidadPrestada', t.CantidadPrestada,
                    'CantidadDevuelta', t.CantidadDevuelta,
                    'CantidadEnObra', t.CantidadEnObra
                )
            ) AS Equipos
        FROM (
            SELECT
                r.DocumentoCliente,
                p.IdProyecto,
                p.Nombre AS Proyecto,
                p.Direccion AS DireccionProyecto,
                dr.IdEquipo,
                e.Nombre AS Equipo,
                c.Categoria,
                SUM(dr.Cantidad) AS CantidadPrestada,
                SUM(COALESCE(devueltos.CantidadDevuelta, 0)) AS CantidadDevuelta,
                SUM(dr.Cantidad - COALESCE(devueltos.CantidadDevuelta, 0)) AS CantidadEnObra
            FROM remisiones r
            INNER JOIN detalles_remisiones dr ON r.IdRemision = dr.IdRemision
            INNER JOIN proyectos p ON r.IdProyecto = p.IdProyecto
            INNER JOIN categorias c ON dr.IdCategoria = c.IdCategoria
            INNER JOIN equipo e ON dr.IdEquipo = e.IdEquipo
            LEFT JOIN (
                SELECT
                    dd.IdEquipo,
                    dd.IdRemision,
                    SUM(dd.Cantidad) AS CantidadDevuelta
                FROM detalles_devoluciones dd
                INNER JOIN devoluciones d ON dd.IdDevolucion = d.IdDevolucion
                WHERE d.IdEstado IN (
                    SELECT IdEstado
                    FROM estado
                    WHERE Estado NOT LIKE '%Anulado%'
                      AND Estado NOT LIKE '%Cancelado%'
                )
                GROUP BY dd.IdEquipo, dd.IdRemision
            ) devueltos ON devueltos.IdRemision = r.IdRemision AND devueltos.IdEquipo = dr.IdEquipo
            WHERE
                r.DocumentoCliente = ?
                ${filtroProyecto}
                AND r.IdEstado IN (
                    SELECT IdEstado
                    FROM estado
                    WHERE Estado NOT LIKE '%Anulado%'
                      AND Estado NOT LIKE '%Cancelado%'
                )
            GROUP BY
                r.DocumentoCliente,
                p.IdProyecto,
                p.Nombre,
                p.Direccion,
                dr.IdEquipo,
                e.Nombre,
                c.Categoria
            #HAVING
                #CantidadEnObra > 0
        ) t
        GROUP BY
            t.DocumentoCliente,
            t.IdProyecto,
            t.Proyecto,
            t.DireccionProyecto
        ORDER BY
            t.Proyecto ASC;
    `;

    return query(sql, params);
};

module.exports = {
    InformeClienteEquiposEnObraQuery
};

