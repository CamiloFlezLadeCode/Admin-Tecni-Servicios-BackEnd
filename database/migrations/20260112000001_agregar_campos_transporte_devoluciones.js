/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const hasIncluye = await knex.schema.hasColumn('devoluciones', 'IncluyeTransporte');
  const hasValor = await knex.schema.hasColumn('devoluciones', 'ValorTransporte');

  await knex.schema.table('devoluciones', function(table) {
    if (!hasIncluye) {
        table.boolean('IncluyeTransporte').defaultTo(false);
    }
    if (!hasValor) {
        table.integer('ValorTransporte').defaultTo(0);
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('devoluciones', function(table) {
      table.dropColumn('IncluyeTransporte');
      table.dropColumn('ValorTransporte');
  });
};
