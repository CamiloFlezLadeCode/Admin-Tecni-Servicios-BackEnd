/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    //   Create index if it does not exist in the database
    await knex.schema.alterTable('detalles_devoluciones', (table) => {
        table.index(['IdDevolucion', 'IdEquipo', 'IdEstado'], 'idx_detadevo_iddevolucion_equipo_estado');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    //   Drop index on rollback
    await knex.schema.alterTable('detalles_devoluciones', (table) => {
        table.dropIndex(['IdDevolucion', 'IdEquipo', 'IdEstado'], 'idx_detadevo_iddevolucion_equipo_estado');
    });
};
