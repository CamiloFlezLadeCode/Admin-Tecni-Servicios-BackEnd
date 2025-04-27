// require('dotenv').config();
// const mysql = require('mysql2/promise');


// const Entorno = "Desarrollo";
// let host;
// let user;
// let password;
// let database;
// let port;

// switch (Entorno) {
//     case 'Produccion':
//         host = process.env.DB_HOST;
//         user = process.env.DB_USER;
//         password = process.env.DB_PASSWORD;
//         database = process.env.DB_NAME;
//         port = process.env.PORT;
//     break;

//     case 'Desarrollo':
//         host = 'localhost';
//         user = 'root';
//         password = null;
//         database = 'tecniservicios';
//         port = 3306;
//     break;
// }

// const pool = mysql.createPool({
//     connectionLimit: 10,
//     host: host,
//     user: user,
//     password: password,
//     database: database,
//     port: port,
//     waitForConnections: true,
//     queueLimit: 0,
//     languaje: 'Spanish'
// });

// // Función para realizar consultas
// // export const query = async (sql, values) => {
// //     const [rows] = await pool.query(sql, values);
// //     return rows;
// // };

// const query = async (sql, values) => {
//     try {
//         const [rows] = await pool.query(sql, values);
//         return rows;
//     } catch (error) {
//         console.error("Error en query:", error);
//         throw error;
//     }
// };

// // Verificar la conexión al iniciar
// const testConnection = async () => {
//     try {
//         await pool.query('SELECT 1'); // Consulta simple para verificar la conexión
//         console.log("CONECTADO A LA BASE DE DATOS");
//     } catch (error) {
//         console.error("ERROR AL CONECTAR A LA BASE DE DATOS:", error);
//     }
// };

// // Llamar a la función de prueba de conexión
// testConnection();


// // Manejo del cierre del pool
// process.on('SIGINT', async () => {
//     await pool.end();
//     console.log('Pool de conexiones cerrado');
//     process.exit(0);
// });


// module.exports = { query };

require('dotenv').config();
const mysql = require('mysql2/promise');

// Entorno: 'Produccion' o 'Desarrollo'
const ENTORNO = process.env.NODE_ENV || 'Desarrollo';

// Configuraciones base
const config = {
    Desarrollo: {
        host: 'localhost',
        user: 'root',
        password: null,
        database: 'tecniservicios',
        port: 3306,
        connectionLimit: 10, // tráfico local
    },
    Produccion: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
        connectionLimit: 50, // tráfico de producción más alto
    }
};

// Selecciona la config correcta según entorno
const dbConfig = config[ENTORNO];

// Crear el pool de conexiones
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    queueLimit: 0,
    compress: true,
});

// Función para consultas
const query = async (sql, values) => {
    try {
        const [rows] = await pool.query(sql, values);
        return rows;
    } catch (error) {
        console.error("Error en query:", error);
        throw error;
    }
};

// Verificar conexión
const testConnection = async () => {
    try {
        await pool.query('SELECT 1');
        console.log(`CONECTADO A LA BASE DE DATOS [${ENTORNO}]`);
    } catch (error) {
        console.error("ERROR AL CONECTAR A LA BASE DE DATOS:", error);
    }
};

testConnection();

// Cierre limpio del pool
process.on('SIGINT', async () => {
    await pool.end();
    console.log('Pool de conexiones cerrado');
    process.exit(0);
});

module.exports = { query };
