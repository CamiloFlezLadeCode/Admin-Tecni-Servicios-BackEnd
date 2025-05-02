const { obtenerCredenciales, obtenerRol, obtenerNombre, obtenerDocumento } = require('../../queries/login/loginQueries');

const obtenerCredencialesService = async (clienteData) => {
    const credenciales = await obtenerCredenciales(clienteData);
    
    if (!credenciales || credenciales.length === 0) {
        return { credenciales: null, rol: null }; // No se encontraron credenciales
    }

    const documentoUsuario = credenciales[0].DocumentoUsuario; // Obtiene el documento del usuario
    const rol = await obtenerRol(documentoUsuario); // Usa el documento para obtener el rol
    const nombre = await obtenerNombre(documentoUsuario);
    const documento = await obtenerDocumento(documentoUsuario);
    return {
        credenciales,
        rol: rol.length > 0 ? rol[0].Rol : null, // Devuelve el rol o null si no existe
        nombre: nombre.length > 0 ? nombre[0].Nombre : null,
        documento: documento.length > 0 ? documento[0].DocumentoUsuario : null,
    };
};

module.exports = {
    obtenerCredencialesService
};
