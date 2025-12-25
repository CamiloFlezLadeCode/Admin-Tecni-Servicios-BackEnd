const { InformeInternoEmpresaEquiposEnObraQuery } = require('../../../queries/comercial/estado_de_cuenta/InformeInternoEmpresaEquiposEnObraQuery');

const InformeInternoEmpresaEquiposEnObraService = async (ParametrosConsulta) => {
    return await InformeInternoEmpresaEquiposEnObraQuery(ParametrosConsulta);
};

module.exports = {
    InformeInternoEmpresaEquiposEnObraService
};

