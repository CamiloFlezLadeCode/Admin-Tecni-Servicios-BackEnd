const { query } = require('../../config/db');
const ListarCategoriasQuery = async () => {
    const sql = `
        SELECT		
            IdCategoria,
            Categoria,
            Codigo
        FROM		
            categorias AS cate
        INNER JOIN
            estado AS esta ON cate.IdEstado = esta.IdEstado
        WHERE	
            esta.Estado LIKE '%Activo%'
        ORDER BY
            cate.Categoria ASC
    `;
    return query(sql);
};
module.exports = {
    ListarCategoriasQuery
};