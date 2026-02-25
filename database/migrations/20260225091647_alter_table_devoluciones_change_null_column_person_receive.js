/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    const tableName = 'devoluciones';
    return knex.schema.alterTable(tableName, function (table) {
        table.string('PersonaQueEntrega').nullable().alter();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    const tableName = 'devoluciones';
    return knex.schema.alterTable(tableName, function (table) {
        table.string('PersonaQueEntrega').nullable().alter();
    });
};
