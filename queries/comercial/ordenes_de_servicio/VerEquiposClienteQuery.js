const { query } = require('../../../config/db');

const VerEquiposClienteQuery = async (ParametrosConsultaEquiposCliente) => {
    const sql = `
        SELECT	
            IdEquipo AS IdEquipo,
            Nombre AS NombreEquipo
        FROM
            equipo AS equi
        INNER JOIN
            bodegas AS bode ON equi.IdBodega = bode.IdBodega
        INNER JOIN
            tipo_bodega AS tipobode ON bode.IdTipoBodega = tipobode.IdTipoBodega
        WHERE
            (tipobode.IdTipoBodega = ?) AND (equi.DocumentoSubarrendatario = ?);
    `;
    return query(sql, [
        ParametrosConsultaEquiposCliente.IdTipoBodega,
        ParametrosConsultaEquiposCliente.DocumentoPropietario
    ]);
};
module.exports = {
    VerEquiposClienteQuery
};