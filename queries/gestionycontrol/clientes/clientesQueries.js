const { query } = require('../../../config/db');


const obtenerClientes = async() => {
    const sql = `
        SELECT 
            * 
        FROM 
            usuarios
        ORDER BY
            Nombres ASC
    `;
    return await query(sql);
};

//Query Insertar Usuario
const insertarUsuario = async (clienteData) => {
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


const insertarClienteQuery = async (documentoUsuario, usuarioCreacion) => {
    const sql = `
        INSERT INTO clientes 
            (DocumentoUsuario, UsuarioCreacion)
        VALUES
            (?, ?)
    `;
    return await query(sql, [documentoUsuario, usuarioCreacion]);
};

const obtenerClientePorDocumento = async(clienteData) => {
    const sql = `
        SELECT 
            *
        FROM
            usuarios
        WHERE
            DocumentoUsuario = ?
    `;

    return await query(sql, [
        clienteData.Identificacion,
    ]);
}

const crearClienteCompleto = async (datos) => {
    const usuarioInsertado = await insertarUsuario(datos);
    const clienteInsertado = await insertarClienteQuery(datos.Identificacion, datos.UsuarioCreacion);

    return { usuarioInsertado, clienteInsertado };
};

module.exports = {
    obtenerClientes,
    insertarClienteQuery,
    obtenerClientePorDocumento,
    crearClienteCompleto
};