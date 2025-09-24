const { MostrarSubarrendatariosConRemisionAsignadaQuery } = require('../../../queries/comercial/devoluciones/MostrarSubarrendatariosConRemisionAsignadaQuery');

const MostrarSubarrendatariosConRemisionAsignadaService = async (DatosConsulta) => {
    return await MostrarSubarrendatariosConRemisionAsignadaQuery(DatosConsulta);
};
module.exports = {
    MostrarSubarrendatariosConRemisionAsignadaService
};