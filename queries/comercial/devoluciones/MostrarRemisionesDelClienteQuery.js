const { query } = require('../../../config/db');

const MostrarRemisionesDelClienteQuery = async (Datos) => {
    const sql = `
        SELECT 
            IdRemision AS IdRemision,
            NoRemision AS NoRemision
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