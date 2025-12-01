exports.up = async function (knex) {
  await knex.schema.createTable('salida_repuesto', (table) => {
    table.increments('IdSalidaRepuesto');
    table.integer('NoSalidaRepuestos').notNullable();
    table.dateTime('FechaSalida').notNullable();
    table.string('Responsable', 20).notNullable();
    table.text('Observaciones');
    table.string('UsuarioCreacion', 20).notNullable();
    table.dateTime('FechaCreacion').notNullable();
  });

  await knex.schema.alterTable('salida_repuesto', (table) => {
    table.unique(['NoSalidaRepuestos'], 'uk_salida_rep_no');
    table.index(['FechaCreacion'], 'idx_salida_rep_fechacreacion');
  });
  await knex.raw("ALTER TABLE `salida_repuesto` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci");
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('salida_repuesto');
};