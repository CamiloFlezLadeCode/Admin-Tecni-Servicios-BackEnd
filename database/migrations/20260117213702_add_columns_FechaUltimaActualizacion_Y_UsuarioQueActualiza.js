/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    const FechaUltimaActualizacion = knex.schema.alterTable('remisiones', (table) => {
        table.dateTime('FechaUltimaActualizacion').defaultTo(null);
    });
    const UsuarioQueActualiza = knex.schema.alterTable('remisiones', (table) => {
        table.string('UsuarioQueActualiza', 255);
    });
    return Promise.all([FechaUltimaActualizacion, UsuarioQueActualiza]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable('remisiones', (table) => {
        table.dropColumn('FechaUltimaActualizacion');
        table.dropColumn('UsuarioQueActualiza');
    });
};
