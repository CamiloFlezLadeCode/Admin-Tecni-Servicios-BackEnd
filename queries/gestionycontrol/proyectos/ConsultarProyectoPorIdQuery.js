const { query } = require('../../../config/db');

const ConsultarProyectoPorIdQuery = async (IdProyecto) => {
    const sql = `
        SELECT
            Nombre AS NombreProyecto,
            DocumentoCliente AS DocumentoCliente,
            Direccion AS DireccionProyecto,
            IdEstado AS IdEstadoProyecto
        FROM
            proyectos
        WHERE
            IdProyecto = ?
    `;
    return query(sql, [IdProyecto]);
};
module.exports = {
    ConsultarProyectoPorIdQuery
};