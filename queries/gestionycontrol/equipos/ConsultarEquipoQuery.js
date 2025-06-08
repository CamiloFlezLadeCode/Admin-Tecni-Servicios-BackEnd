const { query } = require('../../../config/db');

const ConsultarEquipoQuery = async (IdEquipo) => {
    const sql = `
        SELECT 
            IdCategoria AS IdCategoria,
            Nombre AS Nombre,
            Cantidad AS Cantidad,
            DocumentoSubarrendatario AS DocumentoSubarrendatario,
            PrecioVenta AS PrecioVenta,
            PrecioAlquiler AS PrecioAlquiler,
            PrecioReparacion AS PrecioReparacion,
            IdEstado AS IdEstado
        FROM
            equipo
        WHERE
            IdEquipo = ?
    `;
    return query(sql, [IdEquipo]);
};
module.exports = {
    ConsultarEquipoQuery
};