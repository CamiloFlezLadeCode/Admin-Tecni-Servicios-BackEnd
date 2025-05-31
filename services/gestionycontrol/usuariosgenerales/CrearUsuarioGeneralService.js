// const { RegistrarUsuarioCompleto } = require('../../../queries/gestionycontrol/usuariosgenerales/CrearUsuarioGeneralQuery');
// const RegistrarUsuarioGeneralService = async (DatosUsuarioGeneral) => {
//     const connection = await pool.getConnection();

//     try {
//         await connection.beginTransaction();

//         // Inserta información general del usuario
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

//         // Insertar roles
//         const DocumentoUsuario = DatosUsuarioGeneral.Documento;
//         const Roles = DatosUsuarioGeneral.Roles;
//         const Resultados = [];

//         for (const rol of Roles) {
//             const sqlRol = `
//         INSERT INTO usuario_roles (DocumentoUsuario, IdRol)
//         VALUES (?, ?)
//       `;
//             const resultado = await connection.query(sqlRol, [DocumentoUsuario, rol]);
//             Resultados.push(resultado);
//         }

//         // Insertar nivel
//         //     const sqlNivel = `
//         //   INSERT INTO usuario_niveles (DocumentoUsuario, IdNivel)
//         //   VALUES (?, ?)
//         // `;
//         //     await connection.query(sqlNivel, [DocumentoUsuario, DatosUsuarioGeneral.Nivel]);

//         // Insertar nivel solo si está definido y es válido
//         if (DatosUsuarioGeneral.Nivel) {
//             const sqlNivel = `
//     INSERT INTO usuario_niveles (DocumentoUsuario, IdNivel)
//     VALUES (?, ?)
//     `;
//             await connection.query(sqlNivel, [DocumentoUsuario, DatosUsuarioGeneral.Nivel]);
//         }
//         await connection.commit(); // ✅ Confirmamos los cambios
//         return Resultados;
//     } catch (error) {
//         await connection.rollback(); // ❌ Revertimos si algo falla
//         throw error;
//     } finally {
//         connection.release(); // 👈 Siempre liberar la conexión
//     }
// };
// module.exports = {
//     RegistrarUsuarioGeneralService
// }



const { RegistrarUsuarioGeneralQuery } = require('../../../queries/gestionycontrol/usuariosgenerales/CrearUsuarioGeneralQuery');
const RegistrarUsuarioGeneralService = async (DatosUsuarioGeneral) => {
    return await RegistrarUsuarioGeneralQuery(DatosUsuarioGeneral);
};
module.exports = {
    RegistrarUsuarioGeneralService
};