// // ORIGINAL INICIAL
// require('dotenv').config();
// // Update with your config settings.
// /**
//  * @type { Object.<string, import("knex").Knex.Config> }
//  */
// module.exports = {

//   development: {
//     client: 'mysql2',
//     connection: {
//       host: 'localhost',
//       user: 'root',
//       password: null,
//       database: 'tecniservicios'
//     },
//     pool: { min: 2, max: 10 },
//     migrations: {
//       directory: './migrations',
//       tableName: 'knex_migrations'
//     },
//     seeds: {
//       directory: './seeds'
//     }
//   },

//   production: {
//     client: 'mysql2',
//     connection: {
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME
//     },
//     pool: { min: 2, max: 10 },
//     migrations: {
//       directory: './migrations',
//       tableName: 'knex_migrations'
//     },
//     seeds: {
//       directory: './seeds'
//     }
//   }

// };



// NUEVA METODOLOGÍA PARA CAPTURAR DINAMICAMENTE EL ENTORNO A EJECUTAR
require('dotenv').config();
// Update with your config settings.
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const Environment = process.env.VARIABLE_ENV_ENTORNO;
const config = {
  Desarrollo: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      user: 'root',
      password: null,
      database: 'tecniservicios'
    },
    pool: { min: 2, max: 10 },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds'
    }
  },

  Produccion: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    pool: { min: 2, max: 10 },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
}
const EnvironmentConfig = config[Environment];
module.exports = EnvironmentConfig;
