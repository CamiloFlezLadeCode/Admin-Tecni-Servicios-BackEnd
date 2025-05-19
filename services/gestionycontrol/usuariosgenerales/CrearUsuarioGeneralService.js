const { RegistrarUsuarioGeneralQuery, RegistrarRolUsuarioGeneralQuery, RegistrarNivelUsuarioGeneralQuery } = require('../../../queries/gestionycontrol/usuariosgenerales/CrearUsuarioGeneralQuery');

const RegistrarUsuarioGeneralService = async (DatosUsuarioGeneral) => {
    //Se inserta la información general del usuario
    await RegistrarUsuarioGeneralQuery(DatosUsuarioGeneral);
    //Se captura el documento del usuario creado
    const DocumentoUsuario = DatosUsuarioGeneral.Documento;
    //Se capturan los roles del usuario
    const Roles = DatosUsuarioGeneral.Roles;
    const Resultados = [];
    //Se insertan los roles del usuario
    for (const rol of Roles) {
        const Resultado = await RegistrarRolUsuarioGeneralQuery(DocumentoUsuario, rol);
        Resultados.push(Resultado);
    }
    //Se captura el nivel del usuario
    const Nivel = DatosUsuarioGeneral.Nivel;
    //Se inserta el nivel del usuario
    await RegistrarNivelUsuarioGeneralQuery(DocumentoUsuario, Nivel);
    return Resultados;
};
module.exports = {
    RegistrarUsuarioGeneralService
};