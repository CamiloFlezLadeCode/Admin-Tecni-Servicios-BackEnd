const { query } = require('../../config/db');

const ConsultarMunicipiosV2 = async (limit, offset, search, lastId = null) => {
    if (lastId) {
        const like = search ? `${search}%` : null;

        if (search) {
            return await query(`
                SELECT 
                    IdMunicipio, IdDepartamento, Codigo, 
                    Nombre, CodigoDepartamento
                FROM municipio
                WHERE IdMunicipio > ?
                  AND (
                      Nombre LIKE ? OR
                      Codigo LIKE ? OR
                      IdDepartamento LIKE ?
                  )
                ORDER BY IdMunicipio
                LIMIT ?
            `, [lastId, like, like, like, limit]);
        }

        return await query(`
            SELECT 
                IdMunicipio, IdDepartamento, Codigo, 
                Nombre, CodigoDepartamento
            FROM municipio
            WHERE IdMunicipio > ?
            ORDER BY IdMunicipio
            LIMIT ?
        `, [lastId, limit]);
    }

    if (search) {
        const like = `${search}%`;

        const results = await query(`
            SELECT 
                IdMunicipio, IdDepartamento, Codigo, 
                Nombre, CodigoDepartamento,
                (SELECT COUNT(*) FROM municipio 
                 WHERE Nombre LIKE ? 
                    OR Codigo LIKE ? 
                    OR IdDepartamento LIKE ?
                ) AS TotalCount
            FROM municipio
            WHERE Nombre LIKE ? 
               OR Codigo LIKE ? 
               OR IdDepartamento LIKE ?
            ORDER BY IdMunicipio
            LIMIT ? OFFSET ?
        `, [like, like, like, like, like, like, limit, offset]);

        return results;
    }

    const results = await query(`
        SELECT 
            IdMunicipio, IdDepartamento, Codigo, 
            Nombre, CodigoDepartamento,
            (SELECT COUNT(*) FROM municipio) AS TotalCount
        FROM municipio
        ORDER BY IdMunicipio
        LIMIT ? OFFSET ?
    `, [limit, offset]);

    return results;
};

module.exports = { ConsultarMunicipiosV2 };