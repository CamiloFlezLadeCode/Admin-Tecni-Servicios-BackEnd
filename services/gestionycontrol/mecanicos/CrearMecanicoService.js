const { CrearMecanicoQuery, CrearRolesQuery } = require('../../../queries/gestionycontrol/mecanicos/CrearMecanicoQuery');

const CrearMecanicoService = async (mecanicoData) => {
    await CrearMecanicoQuery(mecanicoData);

    //Se captura el documento del usuario creado
    const DocumentoUsuario =  mecanicoData.Documento;
    const Roles = mecanicoData.Roles;
    const Resultados = [];    
    for (const rol of Roles) {
        const Resultado = await CrearRolesQuery(DocumentoUsuario, rol);
        Resultados.push(Resultado);
    }
    return Resultados;
};
module.exports = {
    CrearMecanicoService
};