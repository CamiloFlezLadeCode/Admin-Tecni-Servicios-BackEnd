const { query } = require('../../../config/db');

const ConsultarVehiculosQuery = async () => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    const sql = `
        SELECT 
            vehi.IdVehiculo AS IdVehiculo,
            vehi.Placa AS Placa,
            CONCAT(SUBSTRING_INDEX(COALESCE(usu.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu.Apellidos, ''), ' ', 1)) 			  AS UsuarioCreacion,
            DATE_FORMAT(vehi.FechaCreacion, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaCreacion,
            esta.Estado
        FROM
            vehiculos AS vehi
        INNER JOIN
            estado AS esta ON vehi.IdEstado = esta.IdEstado
        LEFT JOIN
            usuario AS usu ON vehi.UsuarioCreacion = usu.DocumentoUsuario
        ORDER BY
            vehi.Placa ASC
    `;
    return query(sql);
};
module.exports = {
    ConsultarVehiculosQuery
};