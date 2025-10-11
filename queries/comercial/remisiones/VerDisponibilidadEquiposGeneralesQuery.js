const { query } = require('../../../config/db');

const VerDisponibilidadEquiposGeneralesQuery = async (ParametrosConsulta) => {
    // const sql = `
    //     SELECT
    //         equi.IdEquipo,
    //         equi.Nombre,
    //         esta.Estado
    //     FROM
    //         equipo as equi
    //     INNER JOIN
    //         estado AS esta ON equi.IdEstado = esta.IdEstado 
    //     WHERE
    //         ( IdCategoria = ? )
    //     ORDER BY
    //         equi.Nombre ASC
    // `;
    const sql = `
            SELECT
            equi.IdEquipo,
            equi.Nombre,
            esta.Estado
        FROM
            equipo as equi
        INNER JOIN
            estado AS esta ON equi.IdEstado = esta.IdEstado 
		INNER JOIN	
        	bodegas AS bode ON equi.IdBodega = bode.IdBodega
		INNER JOIN
        	tipo_bodega AS tipobode ON bode.IdTipoBodega = tipobode.IdTipoBodega
        WHERE
            ( IdCategoria = ? ) AND ( tipobode.IdTipoBodega = ? )
        ORDER BY
            equi.Nombre ASC;
    `;
    return query(sql,[
        ParametrosConsulta.IdCategoria,
        ParametrosConsulta.IdTipoBodega
    ]);
};
module.exports = {
    VerDisponibilidadEquiposGeneralesQuery
};