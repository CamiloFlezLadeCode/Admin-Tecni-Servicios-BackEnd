const { query } = require('../../config/db');


const obtenerClientes = async() => {
    const sql = `
        SELECT * FROM usuario
    `;
    return await query(sql);
};

const insertarCliente = async(clienteData) => {
    const sql = `
        INSERT INTO usuarios 
            (
                DocumentoUsuario, 
                TipoDocumento,
                Nombres, 
                Correo, 
                Direccion, 
                Telefono, 
                Celular,
                IdEstado
            )                
            VALUES 
            (
                ?, ?, ?, ?, ?, ?, ?, ?
            )
    `;

    return await query(sql, [
        clienteData.Identificacion,
        clienteData.TipoIdentificacion,
        clienteData.Nombre,
        clienteData.Correo,
        clienteData.Direccion,
        clienteData.Telefono,
        clienteData.Celular,
        clienteData.Estado,        
    ]);
};


module.exports = {
    obtenerClientes,
    insertarCliente
};