const { query } = require('../../config/db');


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
        clienteData.EstadoCliente,        
    ]);
};

//Query Insertar Cliente
const insertarCliente = async (documentoUsuario, datosCliente) => {
    const sql = `
        INSERT INTO clientes 
            (DocumentoUsuario)
        VALUES
            (?)
    `;

    return await query(sql, [documentoUsuario])
};



// const insertarCliente = async(clienteData) => {
//     const sql = `
//         INSERT INTO usuarios 
//             (
//                 DocumentoUsuario, 
//                 TipoDocumento,
//                 Nombres, 
//                 Correo, 
//                 Direccion, 
//                 Telefono, 
//                 Celular,
//                 IdEstado
//             )                
//             VALUES 
//             (
//                 ?, ?, ?, ?, ?, ?, ?, ?
//             )
//     `;

//     return await query(sql, [
//         clienteData.Identificacion,
//         clienteData.TipoIdentificacion,
//         clienteData.Nombre,
//         clienteData.Correo,
//         clienteData.Direccion,
//         clienteData.Telefono,
//         clienteData.Celular,
//         clienteData.Estado,        
//     ]);
// };

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
    const clienteInsertado = await insertarCliente(datos.Identificacion);

    return { usuarioInsertado, clienteInsertado };
};

module.exports = {
    obtenerClientes,
    insertarCliente,
    obtenerClientePorDocumento,
    crearClienteCompleto
};