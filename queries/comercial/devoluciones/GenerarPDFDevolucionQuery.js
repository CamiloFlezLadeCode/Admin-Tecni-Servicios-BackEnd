const { query } = require('../../../config/db');

const GenerarPDFDevolucionQuery = async (IdDevolucion) => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    const sql = `
        SELECT
            #DATOS CLIENTE - DEVOLUCIÓN
            CONCAT(COALESCE(cliente.Nombres, ''), ' ', COALESCE(cliente.Apellidos, '')) AS Cliente,
            cliente.DocumentoUsuario AS DocumentoCliente,
            proyec.Nombre AS Proyecto,
            proyec.Direccion AS DireccionProyecto,
            cliente.Correo AS Correo,
            cliente.Celular1 AS Celular1,
            cliente.Celular2 AS Celular2,
            cliente.Telefono AS Telefono,
            cliente.Direccion AS DireccionCliente,
            cliente.Contacto,
            #DETALLES DE LA DEVOLUCIÓN
            devo.IdDevolucion AS IdDevolucion,
            devo.NoDevolucion AS NoDevolucion,
            devo.Observaciones AS Observaciones,
            CONCAT(DAYNAME(devo.FechaCreacion), ' ', DATE_FORMAT(devo.FechaCreacion, '%d/%m/%Y a las %l:%i:%s %p')) AS FechaCreacion,
            detadevo.Cantidad AS CantidadEntregada,
            equi.Nombre AS EquipoEntregado,
            #esta.Estado AS EstadoEquipoEntregado,
            CASE
                WHEN esta.Estado IS NULL THEN 'Sin especificar'
                ELSE esta.Estado
            END AS EstadoEquipoEntregado,
            devo.PersonaQueEntrega AS PersonaQueEntrega,
            CONCAT(COALESCE(persorecibe.Nombres, ''), ' ', COALESCE(persorecibe.Apellidos, '')) AS PersonaQueRecibe,
            CONCAT(DAYNAME(devo.FechaDevolucion), ' ', DATE_FORMAT(devo.FechaDevolucion, '%d/%m/%Y a las %l:%i:%s %p')) AS FechaDevolucion,
            devo.IncluyeTransporte,
            devo.ValorTransporte
        FROM
            devoluciones AS devo 
        INNER JOIN 
            usuario AS cliente ON devo.DocumentoCliente = cliente.DocumentoUsuario
        INNER JOIN
            proyectos AS proyec ON devo.IdProyecto = proyec.IdProyecto
        INNER JOIN
            detalles_devoluciones AS detadevo ON devo.IdDevolucion = detadevo.IdDevolucion
        INNER JOIN
            equipo AS equi ON detadevo.IdEquipo = equi.IdEquipo
        #INNER JOIN
        LEFT JOIN
            estado AS esta ON detadevo.IdEstado = esta.IdEstado
        LEFT JOIN
            usuario AS persorecibe ON devo.PersonaQueRecibe = persorecibe.DocumentoUsuario
        WHERE 
            devo.IdDevolucion = ?
    `;
    return query(sql, [IdDevolucion]);
};
module.exports = {
    GenerarPDFDevolucionQuery
};