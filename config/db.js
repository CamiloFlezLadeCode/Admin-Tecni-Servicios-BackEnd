require('dotenv').config();
const mysql = require('mysql2/promise');

// Entorno: 'Produccion' o 'Desarrollo'
const ENTORNO = process.env.VARIABLE_ENV_ENTORNO;
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
    // multipleStatements: true // Habilita múltiples sentencias en un solo query, tener cuidado porque con esto se puede estar propenso a SQL injection si no se sanetizan muy bien los datos inputs
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

module.exports = { query, pool };