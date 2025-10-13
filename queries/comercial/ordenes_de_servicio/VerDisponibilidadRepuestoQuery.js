const { query } = require('../../../config/db');

const VerDisponiblidadRepuestoQuery = async (ParametrosBusquedaCantidadRepuestoDisponible) => {
    const sql = `
        SELECT 
            repues.IdRepuesto AS IdRepuesto,
            repues.Nombre AS NombreRepuesto,
            repues.CantidadDisponible AS CantidadDisponibleRepuesto
        FROM 
            repuestos AS repues
        INNER JOIN 
            bodegas AS bode ON repues.IdBodega = bode.IdBodega
        INNER JOIN
            tipo_bodega AS tipobode ON bode.IdTipoBodega = tipobode.IdTipoBodega
        WHERE
            (tipobode.IdTipoBodega = ?) AND (repues.IdRepuesto = ?)
    `;
    return query(sql, [
        ParametrosBusquedaCantidadRepuestoDisponible.IdTipoBodega,
        ParametrosBusquedaCantidadRepuestoDisponible.IdRepuesto
    ]);
};
module.exports = {
    VerDisponiblidadRepuestoQuery
};