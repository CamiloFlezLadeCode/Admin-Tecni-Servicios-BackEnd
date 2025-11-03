const { query } = require('../../../config/db');

const VisualizarEntradaRepuestosQuery = async (NoEntradaRepuestos) => {
    const sql = `
        SELECT
            er.NoEntradaRepuestos,
            er.FechaEntrada,
            er.Responsable,
            CONCAT(p.Nombres, ' ', p.Apellidos) AS NombreResponsable,
            er.Observaciones,
            er.UsuarioCreacion,
            CONCAT(uc.Nombres, ' ', uc.Apellidos) AS CreadoPor,
                    er.FechaCreacion,
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'IdRepuesto', erd.IdRepuesto,
                            'Repuesto', r.Nombre,
                            'Cantidad', erd.Cantidad,
                            'IdUnidadMedida', erd.IdUnidadDeMedida,
                            'UnidadMedida', um.Nombre,
                            'IdEstado', erd.IdEstado,
                            'Estado', est.Estado,
                            'Observacion', erd.Observaciones
                        )
                    ) AS Repuestos
        FROM
            entrada_repuesto AS er 
        LEFT JOIN entrada_repuesto_detalle erd ON er.IdEntradaRepuesto = erd.IdEntradaRepuesto
        LEFT JOIN repuestos r ON erd.IdRepuesto = r.IdRepuesto
        LEFT JOIN unidad um ON erd.IdUnidadDeMedida = um.IdUnidad
        LEFT JOIN estado est ON erd.IdEstado = est.IdEstado
        LEFT JOIN usuario p ON er.Responsable = p.DocumentoUsuario
        LEFT JOIN usuario uc ON er.UsuarioCreacion = uc.DocumentoUsuario
        WHERE NoEntradaRepuestos = ?
        GROUP BY er.IdEntradaRepuesto
        ORDER BY er.FechaEntrada DESC
    `;
    return query(sql, [NoEntradaRepuestos]);
};
module.exports = {
    VisualizarEntradaRepuestosQuery
};