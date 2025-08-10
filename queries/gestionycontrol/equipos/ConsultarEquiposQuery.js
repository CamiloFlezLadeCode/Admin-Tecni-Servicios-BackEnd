const { query } = require('../../../config/db');

const ConsultarEquiposQuery = async () => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    // const sql = `
    //     SELECT	
    //         equi.IdEquipo AS IdEquipo,
    //         equi.Nombre AS NombreEquipo,
    //         cate.Categoria AS CategoriaEquipo,
    //         equi.PrecioVenta AS PrecioVenta,
    //         equi.PrecioAlquiler AS PrecioAlquiler,
    //         equi.PrecioReparacion AS PrecioReparacion,
    //         CONCAT(SUBSTRING_INDEX(COALESCE(usu.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu.Apellidos, ''), ' ', 1) ) AS UsuarioCreacion,
    //         CONCAT(DAYNAME(equi.FechaCreacion), ' ', DATE_FORMAT(equi.FechaCreacion, '%d/%m/%Y a las %l:%i:%s %p')) AS FechaCreacion,
    //         esta.Estado,
    //         equi.Cantidad AS Cantidad,
    //         equi.CantidadDisponible AS CantidadDisponible,
    //         #CONCAT(SUBSTRING_INDEX(COALESCE(usu_arrendatario.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu_arrendatario.Apellidos, ''), ' ', 1) ) AS Subarrendatario
    //         CASE	
    //         	WHEN 
    //             	COALESCE(equi.DocumentoSubarrendatario, '0') = '0' THEN 'TECNISERVICIOS J.F S.A.S'
    //             ELSE
    //             	CONCAT(SUBSTRING_INDEX(COALESCE(usu_arrendatario.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu_arrendatario.Apellidos, ''), ' ', 1) )
    // 		END AS Subarrendatario
    //     FROM	
    //         equipo AS equi
    //     INNER JOIN
    //         categorias AS cate ON equi.IdCategoria = cate.IdCategoria
    //     LEFT JOIN	
    //         usuario AS usu ON equi.UsuarioCreacion = usu.DocumentoUsuario
    //     LEFT JOIN	
    //     	usuario AS usu_arrendatario ON equi.DocumentoSubarrendatario = usu_arrendatario.DocumentoUsuario
    //     INNER JOIN	
    //         estado AS esta ON equi.IdEstado = esta.IdEstado
    //     ORDER BY
    //         equi.Nombre ASC
    // `;
    const sql = `
        SELECT	
            equi.IdEquipo AS IdEquipo,
            bode.NombreBodega AS BodegaUbicacion,
            tipo_equi.TipoEquipo AS TipoDeEquipo,
            equi.Nombre AS NombreEquipo,
            cate.Categoria AS CategoriaEquipo,
            equi.PrecioVenta AS PrecioVenta,
            equi.PrecioAlquiler AS PrecioAlquiler,
            equi.PrecioReparacion AS PrecioReparacion,
            CONCAT(SUBSTRING_INDEX(COALESCE(usu.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu.Apellidos, ''), ' ', 1) ) AS UsuarioCreacion,
            CONCAT(DAYNAME(equi.FechaCreacion), ' ', DATE_FORMAT(equi.FechaCreacion, '%d/%m/%Y a las %l:%i:%s %p')) AS FechaCreacion,
            esta.Estado,
            equi.Cantidad AS Cantidad,
            equi.CantidadDisponible AS CantidadDisponible,
            uni.Nombre AS UnidadDeMedida,
            #CONCAT(SUBSTRING_INDEX(COALESCE(usu_arrendatario.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu_arrendatario.Apellidos, ''), ' ', 1) ) AS Subarrendatario
            CASE	
            	WHEN 
                	(COALESCE(equi.DocumentoSubarrendatario, '0') = '0' OR COALESCE(equi.DocumentoSubarrendatario, 'ABC') = 'ABC') THEN 'TECNISERVICIOS J.F S.A.S'
                ELSE
                	CONCAT(SUBSTRING_INDEX(COALESCE(usu_arrendatario.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu_arrendatario.Apellidos, ''), ' ', 1) )
			END AS Subarrendatario
        FROM	
            equipo AS equi
        INNER JOIN
            categorias AS cate ON equi.IdCategoria = cate.IdCategoria
        LEFT JOIN	
            usuario AS usu ON equi.UsuarioCreacion = usu.DocumentoUsuario
        LEFT JOIN	
        	usuario AS usu_arrendatario ON equi.DocumentoSubarrendatario = usu_arrendatario.DocumentoUsuario
        INNER JOIN	
            estado AS esta ON equi.IdEstado = esta.IdEstado
		INNER JOIN
        	tipo_equipo AS tipo_equi ON equi.IdTipoEquipo = tipo_equi.IdTipoEquipo
		INNER JOIN	
        	unidad AS uni ON equi.IdUnidadDeMedida = uni.IdUnidad
		INNER JOIN
        	bodegas AS bode ON equi.IdBodega = bode.IdBodega
        ORDER BY
            equi.Nombre ASC    
    `;
    return query(sql);
}
module.exports = {
    ConsultarEquiposQuery
};