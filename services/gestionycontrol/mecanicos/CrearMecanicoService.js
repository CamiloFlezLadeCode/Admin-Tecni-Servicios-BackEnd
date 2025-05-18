const { CrearMecanicoQuery, CrearRolesQuery, CrearNivelQuery } = require('../../../queries/gestionycontrol/mecanicos/CrearMecanicoQuery');

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
    const Nivel = mecanicoData.Nivel;
    await CrearNivelQuery(DocumentoUsuario, Nivel);
    return Resultados;
};
module.exports = {
    CrearMecanicoService
};