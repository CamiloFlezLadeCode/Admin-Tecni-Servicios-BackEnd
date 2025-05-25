const { pool } = require('../../../config/db'); // Asegúrate de usar mysql2/promise
const { FechaActualColombia } = require('../../../utils/FechaActualColombia');

const ActualizarUsuarioGeneralQuery = async (DatosUsuarioAActualizar) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // Actualizar los datos del usuario
        const sql = `
            UPDATE 
                usuario
            SET 
                TipoDocumento = ?, 
                Nombres = ?, 
                Apellidos = ?, 
                Correo = ?, 
                Direccion = ?, 
                Telefono = ?, 
                Celular = ?, 
                IdEstado = ? 
            WHERE
                DocumentoUsuario = ?
        `;

        await connection.query(sql, [
            DatosUsuarioAActualizar.TipoDocumento,
            DatosUsuarioAActualizar.Nombres,
            DatosUsuarioAActualizar.Apellidos,
            DatosUsuarioAActualizar.Correo,
            DatosUsuarioAActualizar.Direccion,
            DatosUsuarioAActualizar.Telefono,
            DatosUsuarioAActualizar.Celular,
            // DatosUsuarioAActualizar.UsuarioCreacion,
            // FechaActualColombia(), // Actualiza la fecha de creación si es necesario
            DatosUsuarioAActualizar.Estado,
            DatosUsuarioAActualizar.Documento // Usar el Documento para la condición WHERE
        ]);

        // Actualizar roles
        const sqlRolDelete = `
            DELETE FROM usuario_roles 
            WHERE DocumentoUsuario = ?;
        `;
        await connection.query(sqlRolDelete, [DatosUsuarioAActualizar.Documento]); // Eliminar roles anteriores

        const Roles = DatosUsuarioAActualizar.Roles;
        const Resultados = [];
        for (const rol of Roles) {
            const sqlRolInsert = `
                INSERT INTO usuario_roles (DocumentoUsuario, IdRol)
                VALUES (?, ?);
            `;
            const resultado = await connection.query(sqlRolInsert, [DatosUsuarioAActualizar.Documento, rol]); // Insertar nuevo rol
            Resultados.push(resultado);
        }

        // Actualizar niveles
        if (DatosUsuarioAActualizar.Nivel) {
            const sqlNivelDelete = `
                DELETE FROM usuario_niveles 
                WHERE DocumentoUsuario = ?;
            `;
            await connection.query(sqlNivelDelete, [DatosUsuarioAActualizar.Documento]); // Eliminar niveles anteriores

            const sqlNivelInsert = `
                INSERT INTO usuario_niveles (DocumentoUsuario, IdNivel)
                VALUES (?, ?);
            `;
            await connection.query(sqlNivelInsert, [DatosUsuarioAActualizar.Documento, DatosUsuarioAActualizar.Nivel]); // Insertar nuevo nivel
        }

        await connection.commit(); // ✅ Confirmar todo si fue exitoso
        return { success: true };
    } catch (error) {
        await connection.rollback(); // ❌ Revertir si falla algo
        throw error; // Propagar el error
    } finally {
        connection.release(); // Asegurarse de liberar la conexión
    }
};

module.exports = {
    ActualizarUsuarioGeneralQuery
};