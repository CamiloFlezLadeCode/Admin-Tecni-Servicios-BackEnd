const { query } = require('../../../config/db');

const ConsultarEquipoQuery = async (IdEquipo) => {
    const sql = `
        SELECT 
            IdCategoria AS IdCategoria,
            equipo.Nombre AS Nombre,
            Cantidad AS Cantidad,
            DocumentoSubarrendatario AS DocumentoSubarrendatario,
            PrecioVenta AS PrecioVenta,
            PrecioAlquiler AS PrecioAlquiler,
            PrecioReparacion AS PrecioReparacion,
            equipo.IdEstado AS IdEstado,
            unidad.IdUnidad AS IdUnidadDeMedida,
            unidad.Nombre AS UnidadDeMedida
        FROM
            equipo
		INNER JOIN
        	unidad ON equipo.IdUnidadDeMedida = unidad.IdUnidad
        WHERE
            IdEquipo = ?
    `;
    return query(sql, [IdEquipo]);
};
module.exports = {
    ConsultarEquipoQuery
};