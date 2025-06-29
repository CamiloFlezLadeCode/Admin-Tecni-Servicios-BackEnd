// const { query } = require('../../../config/db');
// const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

// const RegistrarUsuarioGeneralQuery = async (DatosUsuarioGeneral) => {
//     const sql = `
//         INSERT INTO 
//             usuario 
//                 (
//                     DocumentoUsuario, 
//                     TipoDocumento, 
//                     Nombres, 
//                     Apellidos, 
//                     Correo, 
//                     Direccion, 
//                     Telefono, 
//                     Celular, 
//                     UsuarioCreacion, 
//                     FechaCreacion, 
//                     IdEstado
//                 ) 
//         VALUES 
//             ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )
//     `;
//     return query(sql, [
//         DatosUsuarioGeneral.Documento,
//         DatosUsuarioGeneral.TipoDocumento,
//         DatosUsuarioGeneral.Nombres,
//         DatosUsuarioGeneral.Apellidos,
//         DatosUsuarioGeneral.Correo,
//         DatosUsuarioGeneral.Direccion,
//         DatosUsuarioGeneral.Telefono,
//         DatosUsuarioGeneral.Celular,
//         DatosUsuarioGeneral.UsuarioCreacion,
//         FechaActualColombia(),
//         DatosUsuarioGeneral.Estado
//     ]);
// };
// const RegistrarRolUsuarioGeneralQuery = async (DocumentoUsuario, Rol) => {
//     const sql = `
//         INSERT INTO usuario_roles 
//             (
//                 DocumentoUsuario, 
//                 IdRol
//             ) 
//         VALUES 
//             ( ?, ? )
//     `;
//     return await query(sql, [
//         DocumentoUsuario, Rol
//     ]);
// };
// const RegistrarNivelUsuarioGeneralQuery = async (DocumentoUsuario, Nivel) => {
//     const sql = `
//         INSERT INTO usuario_niveles
//             (
//                 DocumentoUsuario,
//                 IdNivel
//             )
//         VALUES
//             ( ?, ? )
//     `;
//     return await query(sql, [
//         DocumentoUsuario, Nivel
//     ])
// };
// module.exports = {
//     RegistrarUsuarioGeneralQuery,
//     RegistrarRolUsuarioGeneralQuery,
//     RegistrarNivelUsuarioGeneralQuery
// };


// //Caso sdfasf
// const { pool } = require('../../../config/db'); // Asegúrate de usar mysql2/promise
// const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

// const RegistrarUsuarioCompleto = async (DatosUsuarioGeneral, Rol, Nivel) => {
//     const connection = await pool.getConnection();
//     await connection.beginTransaction();

//     try {
//         const sqlUsuario = `
//       INSERT INTO usuario 
//         (DocumentoUsuario, TipoDocumento, Nombres, Apellidos, Correo, Direccion, Telefono, Celular, UsuarioCreacion, FechaCreacion, IdEstado) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;
//         await connection.query(sqlUsuario, [
//             DatosUsuarioGeneral.Documento,
//             DatosUsuarioGeneral.TipoDocumento,
//             DatosUsuarioGeneral.Nombres,
//             DatosUsuarioGeneral.Apellidos,
//             DatosUsuarioGeneral.Correo,
//             DatosUsuarioGeneral.Direccion,
//             DatosUsuarioGeneral.Telefono,
//             DatosUsuarioGeneral.Celular,
//             DatosUsuarioGeneral.UsuarioCreacion,
//             FechaActualColombia(),
//             DatosUsuarioGeneral.Estado
//         ]);

//         const sqlRol = `
//       INSERT INTO usuario_roles (DocumentoUsuario, IdRol)
//       VALUES (?, ?)
//     `;
//         await connection.query(sqlRol, [DatosUsuarioGeneral.Documento, Rol]);

//         const sqlNivel = `
//       INSERT INTO usuario_niveles (DocumentoUsuario, IdNivel)
//       VALUES (?, ?)
//     `;
//         await connection.query(sqlNivel, [DatosUsuarioGeneral.Documento, Nivel]);

//         await connection.commit(); // ✅ Confirmar todo si fue exitoso
//         connection.release();
//         return { success: true };
//     } catch (error) {
//         await connection.rollback(); // ❌ Revertir si falla algo
//         connection.release();
//         throw error;
//     }
// };
// module.exports = {
//     RegistrarUsuarioCompleto
// }

const { query, pool } = require('../../../config/db');
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');
const RegistrarUsuarioGeneralQuery = async (DatosUsuarioGeneral) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Inserta información general del usuario
    const sqlUsuario = `
      INSERT INTO usuario 
        (DocumentoUsuario, TipoDocumento, Nombres, Apellidos, Correo, Direccion, Telefono, Celular, UsuarioCreacion, FechaCreacion, IdEstado, Contacto) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.query(sqlUsuario, [
      DatosUsuarioGeneral.Documento,
      DatosUsuarioGeneral.TipoDocumento,
      DatosUsuarioGeneral.Nombres,
      DatosUsuarioGeneral.Apellidos,
      DatosUsuarioGeneral.Correo,
      DatosUsuarioGeneral.Direccion,
      DatosUsuarioGeneral.Telefono,
      DatosUsuarioGeneral.Celular,
      DatosUsuarioGeneral.UsuarioCreacion,
      FechaActualColombia(),
      DatosUsuarioGeneral.Estado,
      DatosUsuarioGeneral.Contacto
    ]);

    // Insertar roles
    const DocumentoUsuario = DatosUsuarioGeneral.Documento;
    const Roles = DatosUsuarioGeneral.Roles;
    const Resultados = [];

    for (const rol of Roles) {
      const sqlRol = `
        INSERT INTO usuario_roles (DocumentoUsuario, IdRol)
        VALUES (?, ?)
      `;
      const resultado = await connection.query(sqlRol, [DocumentoUsuario, rol]);
      Resultados.push(resultado);
    }

    // Insertar nivel
    //     const sqlNivel = `
    //   INSERT INTO usuario_niveles (DocumentoUsuario, IdNivel)
    //   VALUES (?, ?)
    // `;
    //     await connection.query(sqlNivel, [DocumentoUsuario, DatosUsuarioGeneral.Nivel]);

    // Insertar nivel solo si está definido y es válido
    if (DatosUsuarioGeneral.Nivel) {
      const sqlNivel = `
    INSERT INTO usuario_niveles (DocumentoUsuario, IdNivel)
    VALUES (?, ?)
    `;
      await connection.query(sqlNivel, [DocumentoUsuario, DatosUsuarioGeneral.Nivel]);
    }
    await connection.commit(); // ✅ Confirmamos los cambios
    return Resultados;
  } catch (error) {
    await connection.rollback(); // ❌ Revertimos si algo falla
    throw error;
  } finally {
    connection.release(); // 👈 Siempre liberar la conexión
  }
};
module.exports = {
  RegistrarUsuarioGeneralQuery
}