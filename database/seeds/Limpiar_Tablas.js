/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Array de tablas que NO se deben limpiar (Tablas de sistema de Knex y otras estáticas)
  const TablasAExcluir = [
    'knex_migrations',
    'knex_migrations_lock',
    'barrio',
    'categorias',
    'cat_tipos_movimiento_equipo',
    'cat_tipos_movimiento_repuesto',
    'departamento',
    'estado',
    'familias_equipos',
    'municipio',
    'niveles',
    'pais',
    'roles',
    'tipodocumento',
    'tipo_bodega',
    'tipo_equipo',
    'tipo_unidad',
    'unidad',

  ];

  try {
    // 1. Desactivar revisión de llaves foráneas para permitir truncar sin conflictos
    await knex.raw('SET FOREIGN_KEY_CHECKS = 0');

    // 2. Obtener todas las tablas de la base de datos actual
    const resultado = await knex.raw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_type = 'BASE TABLE'
    `);

    // En mysql2, el resultado de raw es un array [rows, fields]. Tomamos rows.
    const listaTablas = resultado[0];

    console.log('Iniciando limpieza de tablas...');

    // 3. Iterar sobre las tablas y limpiar las que no estén en la lista de exclusión
    for (const fila of listaTablas) {
      const nombreTabla = fila.TABLE_NAME || fila.table_name; // Compatibilidad de nombres

      if (!TablasAExcluir.includes(nombreTabla)) {
        // Usamos TRUNCATE para borrar datos y reiniciar contadores autoincrementales
        await knex.raw(`TRUNCATE TABLE \`${nombreTabla}\``);
        console.log(`✓ Tabla limpia: ${nombreTabla}`);
      } else {
        console.log(`⏭️ Tabla omitida: ${nombreTabla}`);
      }
    }

    console.log('Limpieza finalizada.');

  } catch (error) {
    console.error('Error durante la limpieza de tablas:', error);
  } finally {
    // 4. Reactivar revisión de llaves foráneas (siempre, incluso si hay error)
    await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
  }
};
