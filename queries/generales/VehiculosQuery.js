const { query } = require('../../config/db');

const ListarVehiculosQuery = async () => {
    const sql = `
        SELECT
            IdVehiculo AS IdVehiculo,
            Placa AS Placa
        FROM
            vehiculos
        ORDER BY
            Placa ASC
    `;
    return query(sql);
};
module.exports = {
    ListarVehiculosQuery
};