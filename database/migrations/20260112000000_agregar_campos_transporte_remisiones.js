/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const hasIncluye = await knex.schema.hasColumn('remisiones', 'IncluyeTransporte');
  const hasValor = await knex.schema.hasColumn('remisiones', 'ValorTransporte');

  await knex.schema.table('remisiones', function (table) {
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
exports.down = function (knex) {
  return knex.schema.table('remisiones', function (table) {
    table.dropColumn('IncluyeTransporte');
    table.dropColumn('ValorTransporte');
  });
};
