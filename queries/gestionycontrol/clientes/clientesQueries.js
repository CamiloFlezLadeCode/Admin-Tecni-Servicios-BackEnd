const { query } = require('../../../config/db');


const obtenerClientes = async () => {
    // await query(`
    //     -- Ejecutar esto por separado antes del SELECT
    //     SET lc_time_names = 'es_ES';
    // `);
    const sql = `
        -- Consulta principal
        SELECT 
            CONCAT(COALESCE(usu.Nombres, ''), ' ', COALESCE(usu.Apellidos, '')) AS Nombre,
            tipodocumento.Codigo AS TipoDocumento,
            usu.DocumentoUsuario AS Documento,
            usu.Correo AS Correo,
            usu.Direccion AS Direccion,
            usu.Telefono AS Telefono,
            usu.Celular AS Celular,
            #CONCAT(COALESCE(usu2.Nombres, ''), ' ', COALESCE(usu2.Apellidos, '')) AS CreadoPor,
            #CONCAT(SUBSTRING_INDEX(COALESCE(usu2.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu2.Apellidos, ''), ' ', 1) ) AS CreadoPor,
            #CONCAT(SUBSTRING_INDEX(COALESCE(usu2.Nombres, ''), ' ', 1), ' ', SUBSTRING_INDEX(COALESCE(usu2.Apellidos, ''), ' ', 1)) AS CreadoPor,
            IFNULL(
                CONCAT(
                    SUBSTRING_INDEX(COALESCE(usu2.Nombres, ''), ' ', 1), ' ',
                    SUBSTRING_INDEX(COALESCE(usu2.Apellidos, ''), ' ', 1)
                ),
                'Desconocido'
            ) AS CreadoPor,
            CONCAT(DAYNAME(usu.FechaCreacion), ' ', DATE_FORMAT(usu.FechaCreacion, '%d/%m/%Y a las %l:%i:%s %p')) AS FechaCreacion, 
            estado.Estado AS Estado,
            rol.Rol AS Rol
        FROM 
            usuario usu
        #INNER JOIN
        #   usuario usu2 ON usu.UsuarioCreacion = usu2.DocumentoUsuario -- corregido
        LEFT JOIN usuario usu2 ON usu.UsuarioCreacion = usu2.DocumentoUsuario
        INNER JOIN
            tipodocumento ON usu.TipoDocumento = tipodocumento.IdTipoDocumento
        INNER JOIN
            estado ON usu.IdEstado = estado.IdEstado
        INNER JOIN	
            usuarioroles usurol ON usu.DocumentoUsuario = usurol.DocumentoUsuario
        INNER JOIN
            roles rol ON usurol.IdRol = rol.IdRol
        WHERE	
            rol.Rol = 'Cliente'
        ORDER BY
            usu.Nombres ASC, usu.Apellidos ASC;
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

const obtenerClientePorDocumento = async (DocumentoUsuario) => {
    const sql = `
        SELECT 
            *
        FROM
            usuario
        WHERE
            DocumentoUsuario = ?
    `;

    return await query(sql, [DocumentoUsuario]);
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