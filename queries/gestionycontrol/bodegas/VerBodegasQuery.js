const { query } = require('../../../config/db');

const VerBodegasQuery = async () => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    const sqls = `
        SELECT
            bode.IdBodega AS IdBodega,
            bode.NombreBodega AS NombreBodega,
            bode.Descripcion AS DescripcionBodega,
            CONCAT(SUBSTRING_INDEX(COALESCE(usu.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu.Apellidos, ''), ' ', 1) ) AS UsuarioCreacion,
            CONCAT(DAYNAME(bode.FechaCreacion), ' ', DATE_FORMAT(bode.FechaCreacion, '%d/%m/%Y a las %l:%i:%s %p')) AS FechaCreacion,
            esta.Estado AS EstadoBodega,
            tipo.TipoBodega AS TipoBodega
        FROM
            bodegas AS bode
        INNER JOIN
            usuario AS subarrendatario ON bode.DocumentoSubarrendatario = subarrendatario.DocumentoUsuario
        INNER JOIN 
            usuario AS usu ON bode.UsuarioCreacion = usu.DocumentoUsuario
        INNER JOIN	
            tipo_bodega AS tipo ON bode.IdTipoBodega = tipo.IdTipoBodega
        INNER JOIN
            estado AS esta ON bode.IdEstado = esta.IdEstado
        ORDER BY
            bode.FechaCreacion DESC
    `;

    const sql = `
        SELECT
            bode.IdBodega AS IdBodega,
            bode.NombreBodega AS NombreBodega,
            bode.Descripcion AS DescripcionBodega,
            CONCAT(SUBSTRING_INDEX(COALESCE(usu.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu.Apellidos, ''), ' ', 1) ) AS UsuarioCreacion,
            CONCAT(DAYNAME(bode.FechaCreacion), ' ', DATE_FORMAT(bode.FechaCreacion, '%d/%m/%Y a las %l:%i:%s %p')) AS FechaCreacion,
            esta.Estado AS EstadoBodega,
            tipo.TipoBodega AS TipoBodega  
        FROM
            bodegas AS bode
        INNER JOIN 
            usuario AS usu ON bode.UsuarioCreacion = usu.DocumentoUsuario
        INNER JOIN	
            tipo_bodega AS tipo ON bode.IdTipoBodega = tipo.IdTipoBodega
        INNER JOIN
            estado AS esta ON bode.IdEstado = esta.IdEstado
        ORDER BY
            bode.FechaCreacion DESC
    `;
    return query(sql);
};
module.exports = {
    VerBodegasQuery
};