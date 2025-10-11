const { query } = require('../../../config/db');

const VerRepuestosDisponiblesQuery = async (ParametrosDeBusqueda) => {
    const sql = `
        SELECT 
            repues.Nombre AS NombreRepuesto,
            repues.IdRepuesto AS IdRepuesto
        FROM 
            repuestos AS repues 
        INNER JOIN
            bodegas AS bode ON repues.IdBodega = bode.IdBodega
        INNER JOIN
            tipo_bodega tipobode ON bode.IdTipoBodega = tipobode.IdTipoBodega
        WHERE
            tipobode.IdTipoBodega = ?
        ORDER BY 
            repues.Nombre ASC
    `;
    return query(sql, [
        ParametrosDeBusqueda.IdTipoBodega
    ]);
};
module.exports = {
    VerRepuestosDisponiblesQuery
};