// const { query } = require('../../config/db');

// const ListarBodegasPorSubarrendatarioQuery = async (DocumentoSubarrendatario) => {
//     const sql = `
//         SELECT 
//             NombreBodega, IdBodega
//         FROM
//             bodegas
//         #WHERE
//             DocumentoSubarrendatario = ?
//         ORDER BY
//             NombreBodega ASC
//     `;
//     // return query(sql, [DocumentoSubarrendatario]);
//     return query(sql);
// };
// module.exports = {
//     ListarBodegasPorSubarrendatarioQuery
// };




const { query } = require('../../config/db');

const ListarBodegasPorSubarrendatarioQuery = async (DocumentoSubarrendatario) => {
    try {
        const sql = `
            SELECT 
                NombreBodega, IdBodega
            FROM
                bodegas
            #WHERE
            #    DocumentoSubarrendatario = ?
            ORDER BY
                NombreBodega ASC
        `;
        const results = await query(sql);

        // Asegurar que siempre devuelva un array
        return Array.isArray(results) ? results : [];

    } catch (error) {
        console.error('❌ Error en ListarBodegasPorSubarrendatarioQuery:', {
            message: error.message,
            sql: 'SELECT bodegas',
            timestamp: new Date().toISOString()
        });

        // Devuelve array vacío en caso de error
        return [];
    }
};

module.exports = {
    ListarBodegasPorSubarrendatarioQuery
};