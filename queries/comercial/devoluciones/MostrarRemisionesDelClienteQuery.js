const { query } = require('../../../config/db');

const MostrarRemisionesDelClienteQuery = async (Datos) => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    const sql = `
        SELECT 
            IdRemision AS IdRemision,
            NoRemision AS NoRemision,
            DATE_FORMAT(FechaCreacion, '%W %d/%m/%Y a las %l:%i:%s %p') AS FechaCreacion
        FROM
            remisiones
        WHERE
            ( DocumentoCliente = ? AND IdProyecto = ? )
        #ORDER BY
            #NoRemision DESC
        ORDER BY 
            CAST(REGEXP_SUBSTR(NoRemision, '[0-9]+') AS UNSIGNED) DESC
    `;
    return query(sql, [
        Datos.Cliente,
        Datos.Proyecto
    ]);
};
module.exports = {
    MostrarRemisionesDelClienteQuery
};