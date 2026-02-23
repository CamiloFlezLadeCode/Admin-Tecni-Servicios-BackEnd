/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    const tableName = 'detalles_devoluciones';
    return knex.schema.alterTable(tableName, function (table) {
        table.integer('IdDetalleRemision').unsigned().nullable().after('IdDevolucion');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    const tableName = 'detalles_devoluciones';
    return knex.schema.alterTable(tableName, function (table) {
        table.dropColumn('IdDetalleRemision');
    });
};
