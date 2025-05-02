//Herramientas
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet'); //Para header seguros
require('dotenv').config();

//Rutas APIS
const loginRoutes = require('./routes/login/loginRoute');
const usuarioRoutes = require('./routes/usersRoutes');
const departamentos = require('./routes/departRoutes');
const verusuarios = require('./routes/gestionycontrol/clientes/clientesRoutes');

const crearbackup = require('./routes/backup/crearBackupRoutes');


const app = express();
app.use(helmet());

// Middleware para parsear JSON
app.use(express.json());

// Configuración de CORS
const corsOptions = {
    // origin: '*',
    // origin: 'http://localhost:3001', //Solo peticiones desde el front correcto
    origin: process.env.DOMINIO_FRONTEND || 'NADA MORRRR',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Usar las rutas
app.use(loginRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', departamentos);
app.use(verusuarios);
app.use(crearbackup);
// Para servir archivos de backup si quieres que puedan descargarse
app.use('/api/backups', express.static(path.join(__dirname, 'backups_bd')));

// ✅ __dirname ya está definido en CommonJS, no hace falta calcularlo
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
