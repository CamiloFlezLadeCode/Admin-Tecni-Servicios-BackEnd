const { query } = require('../../config/db');

const ListarTiposMovimientoRepuestoQuery = async () => {
    const sql = `
        SELECT 
            IdTipoMovimiento,
            Nombre,
            Direccion
        FROM 
            cat_tipos_movimiento_repuesto
        WHERE 
            Activo = 1
        ORDER BY 
            IdTipoMovimiento ASC
    `;
    return query(sql);
};
module.exports = {
    ListarTiposMovimientoRepuestoQuery
};