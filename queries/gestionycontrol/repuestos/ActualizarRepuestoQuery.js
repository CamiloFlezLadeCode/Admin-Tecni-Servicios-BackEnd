const { query } = require('../../../config/db');

const ActualizarRepuestoQuery = async (DatosRepuesto) => {
    const sql = `
        UPDATE 
            repuestos 
        SET 
            Nombre = ?, 
            Cantidad = ?, 
            IdEstado = ? 
        WHERE 
            IdRepuesto = ?;
    `;
    return query(sql, [
        DatosRepuesto.NuevoNombreRepuesto,
        DatosRepuesto.NuevaCantidadRepuesto,
        DatosRepuesto.NuevoEstadoRepuesto,
        DatosRepuesto.IdRepuesto
    ]);
};
module.exports = {
    ActualizarRepuestoQuery
};