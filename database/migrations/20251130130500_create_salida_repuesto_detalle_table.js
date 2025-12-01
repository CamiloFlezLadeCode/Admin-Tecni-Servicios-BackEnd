exports.up = async function (knex) {
  await knex.schema.createTable('salida_detalle_repuesto', (table) => {
    table.increments('IdDetalleSalidaRepuesto');
    table.integer('IdSalidaRepuesto').notNullable();
    table.integer('IdRepuesto').notNullable();
    table.integer('Cantidad').notNullable();
    table.integer('IdUnidadDeMedida').notNullable();
    table.integer('IdEstado').notNullable();
    table.text('Observaciones');
  });



  await knex.schema.alterTable('salida_detalle_repuesto', (table) => {
    table.index(['IdSalidaRepuesto'], 'idx_salida_det_rep_idsalida');
    table.index(['IdRepuesto'], 'idx_salida_det_rep_idrepuesto');
  });
  await knex.raw("ALTER TABLE `salida_detalle_repuesto` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci");
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('salida_detalle_repuesto');
};