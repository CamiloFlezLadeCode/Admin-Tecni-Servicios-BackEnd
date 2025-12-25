const { InformeClienteEquiposEnObraQuery } = require('../../../queries/comercial/estado_de_cuenta/InformeClienteEquiposEnObraQuery');

const InformeClienteEquiposEnObraService = async (ParametrosConsulta) => {
    return await InformeClienteEquiposEnObraQuery(ParametrosConsulta);
};

module.exports = {
    InformeClienteEquiposEnObraService
};

