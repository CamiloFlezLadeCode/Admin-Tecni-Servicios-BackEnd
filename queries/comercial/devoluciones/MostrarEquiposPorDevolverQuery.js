const { query } = require('../../../config/db');

const MostrarEquiposPorDevolverQuery = async (Parametros) => {
    const sql = `
        SELECT
            CONCAT('NoRemi: ', r.NoRemision, ' - ', 'Fecha: ', DATE_FORMAT(r.FechaRemision, '%d/%m/%Y %l:%i %p')) AS Descripcion,
            dr.IdDetalleRemision,
            r.IdRemision,
            r.NoRemision,
            u.Nombres AS NombreCliente,
            p.Nombre AS NombreProyecto,
            e.IdEquipo,
            e.Nombre AS NombreEquipo,
            c.Categoria,
            dr.Cantidad AS CantidadArrendada,
            dr.Cantidad - IFNULL(
                (SELECT SUM(dd.Cantidad)
                FROM devoluciones d
                JOIN detalles_devoluciones dd ON d.IdDevolucion = dd.IdDevolucion
                WHERE dd.IdEquipo = dr.IdEquipo
                #AND d.IdRemision = r.IdRemision
                AND dd.IdRemision = r.IdRemision
                /*AND d.IdEstado IN (1, 2)*/
        ), 0) AS CantidadPendiente,
            dr.PrecioUnidad,
            dr.PrecioTotal,
            dr.ObservacionesCliente,
            e.IdEstado AS EstadoActualEquipo,
            es.Estado AS NombreEstadoEquipo
        FROM
            remisiones AS r
        INNER JOIN
            detalles_remisiones AS dr ON r.IdRemision = dr.IdRemision
        INNER JOIN
            equipo AS e ON dr.IdEquipo = e.IdEquipo
        INNER JOIN
            categorias AS c ON e.IdCategoria = c.IdCategoria
        INNER JOIN
            usuario AS u ON r.DocumentoCliente = u.DocumentoUsuario
        INNER JOIN
            proyectos AS p ON r.IdProyecto = p.IdProyecto
        INNER JOIN
            estado AS es ON e.IdEstado = es.IdEstado
        WHERE
            #r.IdRemision = 22
            (r.IdProyecto = ? AND dr.DocumentoSubarrendatario = ?)
            AND (dr.Cantidad > IFNULL(
                (SELECT SUM(dd.Cantidad)
                FROM devoluciones d
                JOIN detalles_devoluciones dd ON d.IdDevolucion = dd.IdDevolucion
                WHERE dd.IdEquipo = dr.IdEquipo
                #AND d.IdRemision = r.IdRemision
                AND dd.IdRemision = r.IdRemision
                AND d.IdEstado IN (1, 2))
            , 0))
        ORDER BY
            r.FechaRemision DESC
    `;
    return query(sql, [
        Parametros.IdProyecto,
        Parametros.DocumentoSubarrendatario,
    ]);
};
module.exports = {
    MostrarEquiposPorDevolverQuery
};