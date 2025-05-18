const { query } = require('../../config/db');

const ListarRolesQuery = async () => {
    const sql = `
        SELECT
            IdRol,
            Rol
        FROM
            roles
        ORDER BY
            Rol ASC
    `;
    return query(sql);
};
module.exports = {
    ListarRolesQuery
};