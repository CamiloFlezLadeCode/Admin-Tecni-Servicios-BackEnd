const { query } = require('../../../config/db');

const VerTodasLasOrdenesDeServicioQuery = async () => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    const sql = `
        SELECT
            orden.IdOrdenDeServicio AS IdOrdenDeServicio,
            orden.NoOrdenDeServicio AS NoOrdenDeServicio,
            CONCAT(SUBSTRING_INDEX(COALESCE(cliente.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(cliente.Apellidos, ''), ' ', 1)) AS Cliente,
            proyec.Nombre AS Proyecto,
            CONCAT(SUBSTRING_INDEX(COALESCE(mecanico.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(mecanico.Apellidos, ''), ' ', 1)) AS Mecanico,
                CONCAT(SUBSTRING_INDEX(COALESCE(usucreacion.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usucreacion.Apellidos, ''), ' ', 1)) AS CreadoPor,
                DATE_FORMAT(orden.FechaCreacion, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaCreacion,
                esta.Estado AS EstadoOrdenDeServicio
        FROM
            ordenes_de_servicio AS orden
        INNER JOIN
            usuario AS cliente ON orden.DocumentoCliente = cliente.DocumentoUsuario
        INNER JOIN
            proyectos AS proyec ON orden.IdProyecto = proyec.IdProyecto
        INNER JOIN
            usuario AS mecanico ON orden.DocumentoMecanico = mecanico.DocumentoUsuario
        INNER JOIN
            usuario AS usucreacion ON orden.UsuarioCreacion = usucreacion.DocumentoUsuario
        INNER JOIN
            estado AS esta ON orden.IdEstado = esta.IdEstado
        ORDER BY
            orden.FechaCreacion DESC    
    `;
    return query(sql);
};
module.exports = {
    VerTodasLasOrdenesDeServicioQuery
};