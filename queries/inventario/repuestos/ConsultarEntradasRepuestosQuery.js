const { query } = require('../../../config/db');

const ConsultarEntradasRepuestosQuery = async () => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    const sql = `
        SELECT
            entra_repues.NoEntradaRepuestos AS NoEntradaRepuestos,
            DATE_FORMAT(entra_repues.FechaEntrada, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaEntrada,
            CONCAT(SUBSTRING_INDEX(COALESCE(usu_responsable.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu_responsable.Apellidos, ''), ' ', 1)) AS Responsable,
            entra_repues.Observaciones AS Observaciones,
            CONCAT(SUBSTRING_INDEX(COALESCE(usu_creacion.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu_creacion.Apellidos, ''), ' ', 1)) AS CreadoPor,
            DATE_FORMAT(entra_repues.FechaCreacion, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaCreacion
        FROM
            entrada_repuesto AS entra_repues
        INNER JOIN
            usuario AS usu_responsable ON entra_repues.Responsable = usu_responsable.DocumentoUsuario
        INNER JOIN
            usuario AS usu_creacion ON entra_repues.UsuarioCreacion = usu_creacion.DocumentoUsuario
        ORDER BY	
            entra_repues.NoEntradaRepuestos DESC    
    `;
    return query(sql);
};
module.exports = {
    ConsultarEntradasRepuestosQuery
};