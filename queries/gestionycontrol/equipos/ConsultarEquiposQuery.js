const { query } = require('../../../config/db');

const ConsultarEquiposQuery = async () => {
    // await query(`
    //     -- Ejecutar esto por separado antes del SELECT
    //     SET lc_time_names = 'es_ES';
    // `);
    const sql = `
        SELECT	
            equi.IdEquipo AS IdEquipo,
            equi.Nombre AS NombreEquipo,
            cate.Categoria AS CategoriaEquipo,
            equi.PrecioVenta AS PrecioVenta,
            equi.PrecioAlquiler AS PrecioAlquiler,
            equi.PrecioReparacion AS PrecioReparacion,
            CONCAT(SUBSTRING_INDEX(COALESCE(usu.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu.Apellidos, ''), ' ', 1) ) AS UsuarioCreacion,
            CONCAT(DAYNAME(equi.FechaCreacion), ' ', DATE_FORMAT(equi.FechaCreacion, '%d/%m/%Y a las %l:%i:%s %p')) AS FechaCreacion,
            esta.Estado
        FROM	
            equipo AS equi
        INNER JOIN
            categorias AS cate ON equi.IdCategoria = cate.IdCategoria
        LEFT JOIN	
            usuario AS usu ON equi.UsuarioCreacion = usu.DocumentoUsuario
        INNER JOIN	
            estado AS esta ON equi.IdEstado = esta.IdEstado
        ORDER BY
            equi.Nombre ASC
    `;
    return query(sql);
}
module.exports = {
    ConsultarEquiposQuery
};