const { query } = require('../../../config/db');

const ConsultarEntradasDeEquiposQuery = async () => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    const sql = `
        SELECT	
            #entra_equi.IdEntradaEquipo AS IdEntradaEquipo,
            entra_equi.NoEntradaEquipos AS NoEntradaEquipos,
            DATE_FORMAT(entra_equi.FechaEntrada, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaEntrada,
            CONCAT(SUBSTRING_INDEX(COALESCE(usu_responsable.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu_responsable.Apellidos, ''), ' ', 1)) AS Responsable,
            entra_equi.Observaciones AS Observaciones,
            CONCAT(SUBSTRING_INDEX(COALESCE(usu_creacion.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu_creacion.Apellidos, ''), ' ', 1)) AS CreadoPor,
            DATE_FORMAT(entra_equi.FechaCreacion, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaCreacion
        FROM
            entrada_equipo AS entra_equi
        INNER JOIN
            usuario AS usu_responsable ON entra_equi.Responsable = usu_responsable.DocumentoUsuario
        INNER JOIN
            usuario AS usu_creacion ON entra_equi.UsuarioCreacion = usu_creacion.DocumentoUsuario
        ORDER BY	
            entra_equi.NoEntradaEquipos DESC
    `;
    return query(sql);
};
module.exports = {
    ConsultarEntradasDeEquiposQuery
};