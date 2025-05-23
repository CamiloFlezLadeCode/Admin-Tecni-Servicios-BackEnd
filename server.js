//Herramientas
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet'); //Para header seguros
const cookieParser = require('cookie-parser');
require('dotenv').config();

//RUTAS APIS
const loginRoutes = require('./routes/login/loginRoute');
const usuarioRoutes = require('./routes/usersRoutes');
const departamentos = require('./routes/departRoutes');
const verusuarios = require('./routes/gestionycontrol/clientes/clientesRoutes');

const crearbackup = require('./routes/backup/crearBackupRoutes');

//usuarios
const UsuariosRoutes = require('./routes/gestionycontrol/usuarios/usuariosRoutes');
//equipos
const EquiposRoutes = require('./routes/gestionycontrol/equipos/equiposRoutes');
//mecanicos
const MecanicosRoutes = require('./routes/gestionycontrol/mecanicos/mecanicosRoutes');
//para listas generales => (Clientes, Paises, Departamentos, Municipios, Sexo, Tipodocumento, )
const ListarDatosGenerales = require('./routes/generales/GeneralesRoutes');
//proyectos
const ProyectosRoutes = require('./routes/gestionycontrol/proyectos/proyectosRoutes');

const app = express();
//Prevención de ataques
// app.use(helmet());
app.use(helmet.hsts({ maxAge: 5184000, includeSubDomains: true }));

app.use(cookieParser());


// Middleware para parsear JSON
app.use(express.json());

// Configuración de CORS
const corsOptions = {
    // origin: '*',
    origin: 'http://localhost:3001', //Solo peticiones desde el front correcto
    // origin: process.env.DOMINIO_FRONTEND || 'NADA MORRRR',
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
app.use(UsuariosRoutes);
app.use(EquiposRoutes);
app.use(MecanicosRoutes);
app.use(ListarDatosGenerales);
app.use(ProyectosRoutes);



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
