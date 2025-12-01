exports.up = async function (knex) {
  await knex.schema.createTable('movimiento_repuesto', (table) => {
    table.increments('IdMovimientoRepuesto');
    table.integer('IdRepuesto').notNullable();
    table.dateTime('Fecha').notNullable();
    table.integer('IdTipoMovimiento').notNullable();
    table.enu('Direccion', ['ENTRADA', 'SALIDA']).notNullable();
    table.integer('Cantidad').notNullable();
    table.string('DocumentoReferencia', 20).notNullable();
    table.integer('IdDocumentoOrigen').notNullable();
    table.string('UsuarioCreacion', 20).notNullable();
    table.dateTime('FechaRegistro').notNullable();
  });

  await knex.schema.alterTable('movimiento_repuesto', (table) => {
    table.index(['IdRepuesto'], 'idx_movrep_idrepuesto');
    table.index(['IdTipoMovimiento', 'Direccion'], 'idx_movrep_tipo_direccion');
    table.index(['Fecha'], 'idx_movrep_fecha');
  });
  await knex.raw("ALTER TABLE `movimiento_repuesto` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci");
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('movimiento_repuesto');
};