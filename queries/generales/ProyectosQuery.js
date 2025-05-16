const { query } = require('../../config/db');

const ListarProyectosQuery = async (proyectosDeCliente) => {
    const sql = `
        SELECT	
            proye.IdProyecto,
            proye.DocumentoCliente,
            proye.Nombre,
            proye.IdEstado,
            esta.Estado
        FROM
            proyectos AS proye
        INNER JOIN
            estado AS esta ON proye.IdEstado = esta.IdEstado
        WHERE
            ( esta.Estado LIKE '%Activo%' ) 
            AND
            ( proye.DocumentoCliente = ? )
        ORDER BY
            proye.Nombre ASC
    `;
    return query(sql, [
        proyectosDeCliente.Cliente
    ]);
};
module.exports = {
    ListarProyectosQuery
};