const { query } = require('../../../config/db');

const VisualizarEntradaEquiposQuery = async (NoEntradaEquipos) => {
    const sql = `
        SELECT 
            ee.NoEntradaEquipos,
            -- Como texto, igual que VerRemisionPorIdQuery / VerDevolucionPorIdQuery: si viajara
            -- como DATETIME, mysql2 lo convertiría a Date con la zona horaria del proceso de Node
            -- y el modal mostraría otra hora que el listado. El front lo lee con
            -- dayjs(fecha, 'DD/MM/YYYY hh:mm:ss A').
            DATE_FORMAT(ee.FechaEntrada, '%d/%m/%Y %r') AS FechaEntrada,
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