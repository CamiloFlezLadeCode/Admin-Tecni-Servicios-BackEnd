const { query } = require('../../../config/db');

const VisualizarEntradaEquiposQuery = async (NoEntradaEquipos) => {
    const sql = `
        SELECT 
            ee.NoEntradaEquipos,
            ee.FechaEntrada,
            ee.Responsable,
            CONCAT(p.Nombres, ' ', p.Apellidos) AS NombreResponsable,
            ee.Observaciones,
            ee.UsuarioCreacion,
            CONCAT(uc.Nombres, ' ', uc.Apellidos) AS CreadoPor,
            ee.FechaCreacion,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'IdEquipo', eed.IdEquipo,
                    'Equipo', e.Nombre,
                    'Cantidad', eed.Cantidad,
                    'IdUnidadMedida', eed.IdUnidadDeMedida,
                    'UnidadMedida', um.Nombre,
                    'IdEstado', eed.IdEstado,
                    'Estado', est.Estado,
                    'Observacion', eed.Observaciones
                )
            ) AS Equipos
        FROM entrada_equipo ee
        LEFT JOIN entrada_equipo_detalle eed ON ee.IdEntradaEquipo = eed.IdEntradaEquipo
        LEFT JOIN equipo e ON eed.IdEquipo = e.IdEquipo
        LEFT JOIN unidad um ON eed.IdUnidadDeMedida = um.IdUnidad
        LEFT JOIN estado est ON eed.IdEstado = est.IdEstado
        LEFT JOIN usuario p ON ee.Responsable = p.DocumentoUsuario
        LEFT JOIN usuario uc ON ee.UsuarioCreacion = uc.DocumentoUsuario
        WHERE NoEntradaEquipos = ?
        GROUP BY ee.IdEntradaEquipo
        ORDER BY ee.FechaEntrada DESC
    `;
    return query(sql, [NoEntradaEquipos]);
};
module.exports = {
    VisualizarEntradaEquiposQuery
};