const { query } = require('../../../config/db');
const { consultaPaginada } = require('../../../utils/paginacion');


// Consulta del listado de clientes, separada de su orden para reutilizarla en la versión paginada.
const SQL_LISTADO_CLIENTES = `
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
            usuario_roles usurol ON usu.DocumentoUsuario = usurol.DocumentoUsuario
        INNER JOIN
            roles rol ON usurol.IdRol = rol.IdRol
        WHERE	
            rol.Rol = 'Cliente'
`;

const ORDEN_LISTADO_CLIENTES = `usu.Nombres ASC, usu.Apellidos ASC`;

const obtenerClientes = async () => {
    await query(`
        -- Ejecutar esto por separado antes del SELECT
        SET lc_time_names = 'es_ES';
    `);
    return await query(`${SQL_LISTADO_CLIENTES}
        ORDER BY ${ORDEN_LISTADO_CLIENTES}`);
};

//Query Insertar Usuario
/**
 * Versión paginada del listado de clientes (ver `utils/paginacion.js`).
 * Busca por nombre y documento, igual que la tabla de clientes.
 */
const obtenerClientesPaginado = async (paginacion) => {
    return consultaPaginada({
        sqlBase: SQL_LISTADO_CLIENTES,
        orden: `${ORDEN_LISTADO_CLIENTES}, usu.IdUsuario ASC`,
        columnasBusqueda: ['Nombre', 'Documento'],
        paginacion,
    });
};

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
    obtenerClientesPaginado,
    insertarClienteQuery,
    obtenerClientePorDocumento,
    crearClienteCompleto
};