const { query } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

const CrearDevolucionQuery = async (DatosDevolucion) => {
    const sql = `

    `;
    return query(sql);
};
module.exports = {
    CrearDevolucionQuery
};