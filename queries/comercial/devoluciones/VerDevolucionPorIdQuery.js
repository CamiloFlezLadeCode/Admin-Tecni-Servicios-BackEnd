const { query } = require('../../../config/db');

const VerDevolucionPorIdQuery = async (IdDevolucion) => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    const sqlDevolucion = `
        SELECT
            devo.IdDevolucion AS IdDevolucion,
            devo.NoDevolucion AS NoDevolucion,
            devo.DocumentoCliente AS DocumentoCliente,
            CONCAT(COALESCE(cliente.Nombres, ''), ' ', COALESCE(cliente.Apellidos, '')) AS Cliente,
            devo.IdProyecto AS IdProyecto,
            proyec.Nombre AS Proyecto,
            devo.Observaciones AS Observaciones,
            devo.PersonaQueRecibe AS PersonaQueRecibe,
            devo.PersonaQueEntrega AS PersonaQueEntrega,
            DATE_FORMAT(devo.FechaDevolucion, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaDevolucion,
            devo.IncluyeTransporte AS IncluyeTransporte,
            devo.ValorTransporte AS ValorTransporte,
            devo.IdEstado AS IdEstado,
            devo.UsuarioCreacion AS UsuarioCreacion,
            (
                SELECT dr.DocumentoSubarrendatario
                FROM detalles_devoluciones dd
                JOIN detalles_remisiones dr ON dd.IdDetalleRemision = dr.IdDetalleRemision
                WHERE dd.IdDevolucion = devo.IdDevolucion
                LIMIT 1
            ) AS DocumentoSubarrendatario
        FROM
            devoluciones AS devo
        INNER JOIN
            usuario AS cliente ON devo.DocumentoCliente = cliente.DocumentoUsuario
        INNER JOIN
            proyectos AS proyec ON devo.IdProyecto = proyec.IdProyecto
        WHERE
            devo.IdDevolucion = ?
    `;

    const sqlDetalles = `
        SELECT
            dd.IdDetalleDevolucion AS IdDetalleDevolucion,
            dd.IdEquipo AS IdEquipo,
            equi.Nombre AS NombreEquipo,
            dr.Cantidad AS CantidadArrendada,
            CAST(
                dr.Cantidad - IFNULL(
                    (
                        SELECT SUM(dd2.Cantidad)
                        FROM detalles_devoluciones dd2
                        JOIN devoluciones d2 ON dd2.IdDevolucion = d2.IdDevolucion
                        WHERE dd2.IdEquipo = dr.IdEquipo
                        AND dd2.IdRemision = remi.IdRemision
                        AND dd2.IdDetalleRemision = dr.IdDetalleRemision
                        AND d2.IdEstado IN (1, 2)
                    ),
                    0
                ) AS CHAR
            ) AS CantidadPendiente,
            dd.Cantidad AS CantidadADevolver,
            IFNULL(
                (
                    SELECT SUM(dd2.Cantidad)
                    FROM detalles_devoluciones dd2
                    JOIN devoluciones d2 ON dd2.IdDevolucion = d2.IdDevolucion
                    WHERE dd2.IdEquipo = dr.IdEquipo
                    AND dd2.IdRemision = remi.IdRemision
                    AND dd2.IdDetalleRemision = dr.IdDetalleRemision
                    AND d2.IdEstado IN (1, 2)
                ),
                0
            ) AS CantidadDevuelta,
            dd.IdEstado AS EstadoEquipo,
            dr.ObservacionesCliente AS Observaciones,
            remi.IdRemision AS IdRemision,
            remi.NoRemision AS NoRemision,
            dr.ObservacionesCliente AS Descripcion,
            dr.DocumentoSubarrendatario AS Subarrendatario
        FROM
            detalles_devoluciones AS dd
        INNER JOIN
            remisiones AS remi ON dd.IdRemision = remi.IdRemision
        INNER JOIN
            detalles_remisiones AS dr ON dd.IdDetalleRemision = dr.IdDetalleRemision
        INNER JOIN
            equipo AS equi ON dd.IdEquipo = equi.IdEquipo
        WHERE
            dd.IdDevolucion = ?
    `;

    const devolucion = await query(sqlDevolucion, [IdDevolucion]);

    if (devolucion.length === 0) {
        return null;
    }

    const detalles = await query(sqlDetalles, [IdDevolucion]);

    return {
        ...devolucion[0],
        Detalles: detalles
    };
};

module.exports = {
    VerDevolucionPorIdQuery
};

