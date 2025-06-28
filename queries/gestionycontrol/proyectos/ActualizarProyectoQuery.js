const { query } = require('../../../config/db');

const ActualizarProyectoQuery = async (DatosProyecto) => {
    const sql = `
        UPDATE 
            proyectos 
        SET 
            DocumentoCliente = ?, 
            Nombre = ?, 
            Direccion = ?, 
            IdEstado = ? 
        WHERE 
            proyectos.IdProyecto = ?;
    `;
    return query(sql, [
        DatosProyecto.NuevoClienteProyecto,
        DatosProyecto.NuevoNombreProyecto,
        DatosProyecto.NuevaDireccionProyecto,
        DatosProyecto.NuevoEstadoProyecto,
        DatosProyecto.IdProyecto,
    ]);
};
module.exports = {
    ActualizarProyectoQuery
};