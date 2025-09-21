const { query } = require('../../../config/db');

const InfoPDFQuery = async (IdRemision) => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    const sql = `
        SELECT
            #DATOS CLIENTE - PROYECTO
            CONCAT(COALESCE(cliente.Nombres, ''), ' ', COALESCE(cliente.Apellidos, '')) AS Cliente,
            cliente.DocumentoUsuario AS DocumentoCliente,
            proye.Nombre AS Proyecto,
            proye.Direccion AS DireccionProyecto,
            cliente.Correo AS Correo,
            cliente.Celular AS Celular,
            cliente.Telefono AS Telefono,
            cliente.Direccion AS DireccionCliente,
            cliente.Contacto,
            #DATOS DETALLES DE LA REMISIÓN
            deta_remi.Cantidad AS Cantidad,
            equi.Nombre AS NombreEquipo,
            remi.ObservacionesEmpresa AS ObservacionesEmpresa,
            #DATOS REMISIÓN
            remi.NoRemision AS NoRemision,
            CONCAT(DAYNAME(remi.FechaCreacion), ' ', DATE_FORMAT(remi.FechaCreacion, '%d/%m/%Y a las %l:%i:%s %p')) AS FechaCreacion, 
            CONCAT(COALESCE(bodeguero.Nombres, ''), ' ', COALESCE(bodeguero.Apellidos, '')) AS Bodeguero,
            CONCAT(COALESCE(despachador.Nombres, ''), ' ', COALESCE(despachador.Apellidos, '')) AS Despachador,
            CONCAT(COALESCE(transportador.Nombres, ''), ' ', COALESCE(transportador.Apellidos, '')) AS 				Transportador,
            vehi.Placa AS PlacaVehiculo,
            remi.NombrePersonaRecibe AS PersonaQueRecibe,
            remi.PlacaVehiculoRecibe AS PlacaVehiculoRecibe,
            deta_remi.ObservacionesCliente AS ObservacionesClienteItem
            
        FROM
            remisiones AS remi
        INNER JOIN
            detalles_remisiones AS deta_remi ON remi.IdRemision = deta_remi.IdRemision
        INNER JOIN 
            usuario AS cliente ON remi.DocumentoCliente = cliente.DocumentoUsuario
        INNER JOIN
            proyectos AS proye ON remi.IdProyecto = proye.IdProyecto
        INNER JOIN
            equipo AS equi ON deta_remi.IdEquipo = equi.IdEquipo
        INNER JOIN
            usuario AS bodeguero ON remi.DocumentoBodeguero = bodeguero.DocumentoUsuario    
        INNER JOIN
            usuario AS despachador ON remi.DocumentoDespachador = despachador.DocumentoUsuario
        #INNER JOIN
        LEFT JOIN
            usuario AS transportador ON remi.DocumentoTransportador = transportador.DocumentoUsuario
		#INNER JOIN		
        LEFT JOIN
        	vehiculos AS vehi ON remi.IdVehiculo = vehi.IdVehiculo
        WHERE
            remi.IdRemision = ?
    `;
    return query(sql, [IdRemision]);
};
module.exports = {
    InfoPDFQuery
};