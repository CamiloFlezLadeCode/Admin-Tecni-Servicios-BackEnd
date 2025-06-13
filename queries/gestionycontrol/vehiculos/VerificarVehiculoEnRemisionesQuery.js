const { query } = require('../../../config/db');

const VerificarVehiculoEnRemisionesQuery = async (IdVehiculo) => {
    const sql = `
        SELECT COUNT(*) AS total
        FROM remisiones
        WHERE IdVehiculo = ?
    `;
    const [resultado] = await query(sql, [IdVehiculo]);
    return resultado.total > 0;
};

module.exports = {
    VerificarVehiculoEnRemisionesQuery
};
