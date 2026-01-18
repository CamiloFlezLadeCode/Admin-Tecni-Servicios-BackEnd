const { query } = require('../../../config/db');

const VerRemisionPorIdQuery = async (IdRemision) => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    const sqlRemision = `
        SELECT	
            remi.IdRemision,
            remi.IdEstado,
            remi.ObservacionesEmpresa,
            remi.IVA,
            remi.PrecioTotalGeneralSinIVA,
            remi.PrecioTotalGeneralConIVA,
            remi.NoRemision,
            remi.IncluyeTransporte,
            remi.ValorTransporte,
            CONCAT(cliente.Nombres, ' ', cliente.Apellidos) AS Cliente,
            proyec.Nombre AS Proyecto,
            CONCAT(usucreacion.Nombres, ' ', usucreacion.Apellidos) AS CreadoPor,
            DATE_FORMAT(remi.FechaCreacion, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaCreacion,
            #remi.FechaCreacion AS FechaCreacion,
            esta.Estado AS EstadoRemision
        FROM
            remisiones AS remi
        INNER JOIN
            usuario AS cliente ON remi.DocumentoCliente = cliente.DocumentoUsuario
        INNER JOIN
            proyectos AS proyec ON remi.IdProyecto = proyec.IdProyecto
        INNER JOIN
            usuario AS usucreacion ON remi.UsuarioCreacion = usucreacion.DocumentoUsuario
        INNER JOIN
            estado AS esta ON remi.IdEstado = esta.IdEstado
        WHERE 
            remi.IdRemision = ?
    `;

    const sqlDetalles = `
        SELECT 
            dr.IdDetalleRemision,
            dr.IdEquipo,
            equi.Nombre AS NombreEquipo,
            dr.Cantidad,
            dr.PrecioUnidad,
            remi.IVA,
            dr.PrecioTotal,
            (dr.Cantidad * dr.PrecioUnidad) AS PrecioTotalSinIVA,
            dr.DocumentoSubarrendatario,
            dr.DocumentoSubarrendatario AS Subarrendatario,
            CONCAT(usu.Nombres, ' ', usu.Apellidos) AS NombreSubarrendatario,
            dr.IdCategoria,
            dr.ObservacionesCliente
        FROM 
            detalles_remisiones dr
        INNER JOIN 
            remisiones remi ON dr.IdRemision = remi.IdRemision
        INNER JOIN
            equipo equi ON dr.IdEquipo = equi.IdEquipo
        LEFT JOIN 
            usuario usu ON dr.DocumentoSubarrendatario = usu.DocumentoUsuario
        WHERE 
            dr.IdRemision = ?
    `;

    const remision = await query(sqlRemision, [IdRemision]);

    if (remision.length === 0) return null;

    const detalles = await query(sqlDetalles, [IdRemision]);

    // Si incluye transporte, agregarlo como un item adicional
    if (remision[0].IncluyeTransporte === 1 || remision[0].IncluyeTransporte === true) {
        detalles.push({
            IdDetalleRemision: 0, // ID ficticio para transporte
            IdEquipo: 0, // ID ficticio para transporte
            NombreEquipo: 'Transporte',
            Cantidad: 1,
            PrecioUnidad: remision[0].ValorTransporte,
            IVA: remision[0].IVA,
            PrecioTotal: remision[0].ValorTransporte,
            PrecioTotalSinIVA: remision[0].ValorTransporte,
            DocumentoSubarrendatario: null,
            Subarrendatario: null,
            NombreSubarrendatario: null,
            IdCategoria: 0,
            ObservacionesCliente: 'Item de transporte'
        });
    }

    return {
        ...remision[0],
        Detalles: detalles
    };
};

module.exports = {
    VerRemisionPorIdQuery
};
