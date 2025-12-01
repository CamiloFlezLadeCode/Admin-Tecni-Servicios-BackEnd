const { query } = require('../../config/db');

const ListarTiposMovimientoEquipoQuery = async () => {
    const sql = `
        SELECT 
            IdTipoMovimiento,
            Nombre,
            Direccion
        FROM 
            cat_tipos_movimiento_equipo
        WHERE 
            Activo = 1
        ORDER BY 
            IdTipoMovimiento ASC
    `;
    return query(sql);
};
module.exports = {
    ListarTiposMovimientoEquipoQuery
};