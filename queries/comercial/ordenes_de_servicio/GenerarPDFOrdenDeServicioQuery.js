const { query } = require('../../../config/db');

const GenerarPDFOrdenDeServicioQuery = async (IdOrdenDeServicio) => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    const sql = `
        SELECT
            #DATOS CLIENTE - ORDEN DE SERVICIO
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
            #DETALLES DE LA ORDEN DE SERVICIO
            equi.Nombre AS NombreEquipo,
            os.Garantia AS Garantia,
            os.IdOrdenDeServicio AS IdOrdenDeServicio,
            os.NoOrdenDeServicio AS NoOrdenDeServicio,
            CONCAT(DAYNAME(os.FechaCreacion), ' ', DATE_FORMAT(os.FechaCreacion, '%d/%m/%Y a las %l:%i:%s %p')) AS FechaCreacion, 
            CONCAT(DAYNAME(os.FechaOrdenDeServicio), ' ', DATE_FORMAT(os.FechaOrdenDeServicio, '%d/%m/%Y a las %l:%i:%s %p')) AS FechaOrdenDeServicio, 
            detaos.Cantidad AS Cantidad,
            detaos.DescripcionEquipo,
            CONCAT(COALESCE(persona_entrega.Nombres, ''), ' ', COALESCE(persona_entrega.Apellidos, '')) AS PersonaQueEntrega,
            os.PersonaQueRecibe AS PersonaQueRecibe,
            os.Descripcion AS Descripcion,
            os.Observaciones AS Observaciones,
            repues.Nombre AS NombreRepuesto
        FROM 
            ordenes_de_servicio AS os
        INNER JOIN
            usuario AS cliente ON os.DocumentoCliente = cliente.DocumentoUsuario
        INNER JOIN
            proyectos AS proyec ON os.IdProyecto = proyec.IdProyecto
        #INNER JOIN
        LEFT JOIN
            detalles_ordenes_de_servicio AS detaos ON os.IdOrdenDeServicio = detaos.IdOrdenDeServicio
        INNER JOIN
            usuario AS persona_entrega ON os.PersonaQueEntrega = persona_entrega.DocumentoUsuario
		#INNER JOIN
        LEFT JOIN
        	repuestos AS repues ON detaos.IdRepuesto = repues.IdRepuesto        
        INNER JOIN
        	equipo AS equi ON os.IdEquipoCliente = equi.IdEquipo                
        WHERE
            os.IdOrdenDeServicio = ?
    `;
    return query(sql, [IdOrdenDeServicio]);
};
module.exports = {
    GenerarPDFOrdenDeServicioQuery
};