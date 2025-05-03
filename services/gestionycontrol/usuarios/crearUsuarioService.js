const { crearUsuarioQuery, crearRolUsuarioQuery } = require('../../../queries/gestionycontrol/usuarios/crearUsuarioQuery');

const crearUsuarioService = async (usuarioData) => {
    await crearUsuarioQuery(usuarioData);

    //Se captura el documento del usuario creado
    const DocumentoUsuario =  usuarioData.DocumentoUsuario;
    const Roles = usuarioData.Roles;
    const Resultados = [];
    
    for (const rol of Roles) {
        const Resultado = await crearRolUsuarioQuery(DocumentoUsuario, rol);
        Resultados.push(Resultado);
    }

    return Resultados;
};
module.exports = {
    crearUsuarioService
};