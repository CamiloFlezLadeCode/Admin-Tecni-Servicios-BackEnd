/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    //   Create index if it does not exist in the database
    await knex.schema.alterTable('devoluciones', (table) => {
        table.index(['DocumentoCliente', 'IdProyecto'], 'idx_devoluciones_documentocliente_idproyecto');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    // Drop index on rollback
    await knex.schema.alterTable('devoluciones', (table) => {
        table.dropIndex(['DocumentoCliente', 'IdProyecto'], 'idx_devoluciones_documentocliente_idproyecto');
    })
};
