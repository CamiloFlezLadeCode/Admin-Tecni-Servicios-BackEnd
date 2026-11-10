const { query } = require('../../config/db');

const ListarVehiculosQuery = async () => {
    const sql = `
        SELECT
            IdVehiculo AS IdVehiculo,
            Placa AS Placa
        FROM
            vehiculos
        WHERE
            IdEstado = ?
        ORDER BY
            Placa ASC
    `;
    const EstadoActivo = 1;
    return query(sql, [EstadoActivo]);
};
module.exports = {
    ListarVehiculosQuery
};