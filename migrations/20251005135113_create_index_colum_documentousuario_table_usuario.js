/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    //   Create index if it does not exist in the database
    await knex.schema.alterTable('usuario', (table) => {
        table.index('DocumentoUsuario', 'idx_usuario_documento');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    // Drop index on rollback
    await knex.schema.alterTable('usuario', (table) => {
        table.dropIndex('DocumentoUsuario', 'idx_usuario_documento');
    })
};
