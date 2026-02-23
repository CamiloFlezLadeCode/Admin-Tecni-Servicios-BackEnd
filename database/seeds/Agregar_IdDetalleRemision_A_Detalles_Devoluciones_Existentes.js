/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  await knex.raw(`
    UPDATE detalles_devoluciones dd
    JOIN (
      SELECT
        dr.IdRemision,
        dr.IdEquipo,
        MIN(dr.IdDetalleRemision) AS IdDetalleRemision
      FROM detalles_remisiones dr
      GROUP BY dr.IdRemision, dr.IdEquipo
    ) dr
      ON dr.IdRemision = dd.IdRemision
      AND dr.IdEquipo = dd.IdEquipo
    SET dd.IdDetalleRemision = dr.IdDetalleRemision
    WHERE dd.IdDetalleRemision IS NULL OR dd.IdDetalleRemision = 0;
  `);
};
