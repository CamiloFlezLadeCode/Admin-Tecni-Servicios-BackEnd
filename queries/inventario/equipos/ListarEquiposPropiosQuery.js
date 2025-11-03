const { query } = require('../../../config/db');
const { EmpresaAnfitriona } = require('../../../utils/constant/default')

const ListarEquiposPropiosQuery = async () => {
    const sql = `
        SELECT 
            IdEquipo AS IdEquipo, 
            Nombre AS NombreEquipo
        FROM 
            equipo 
        WHERE 
            DocumentoSubarrendatario = ?
        ORDER BY 
            Nombre ASC
    `;
    return query(sql, [
        EmpresaAnfitriona.value
    ]);
};
module.exports = {
    ListarEquiposPropiosQuery
};