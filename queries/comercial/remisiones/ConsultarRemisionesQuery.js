const { query } = require('../../../config/db');

const ConsultarRemisionesQuery = async () => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    const sql = `
        SELECT	
            remi.IdRemision AS IdRemision,
            remi.NoRemision AS NoRemision,
            CONCAT(SUBSTRING_INDEX(COALESCE(cliente.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(cliente.Apellidos, ''), ' ', 1)) AS Cliente,
            proyec.Nombre AS Proyecto,
            CONCAT(SUBSTRING_INDEX(COALESCE(usucreacion.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usucreacion.Apellidos, ''), ' ', 1)) AS CreadoPor,
            DATE_FORMAT(remi.FechaCreacion, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaCreacion,    
            remi.ObservacionesEmpresa AS ObservacionesInternasEmpresa,
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
        ORDER BY 
            remi.FechaCreacion DESC
    `;
    return query(sql);
};
module.exports = {
    ConsultarRemisionesQuery
};