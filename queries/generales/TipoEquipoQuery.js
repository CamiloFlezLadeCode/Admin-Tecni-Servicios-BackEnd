const { query } = require('../../config/db');

const ListarTipoEquipoQuery = async () => {
    const sql = `
        SELECT IdTipoEquipo, TipoEquipo FROM tipo_equipo
    `;
    return query(sql);
};
module.exports = {
    ListarTipoEquipoQuery
};