// //Herramientas
// const express = require('express');
// const path = require('path');
// const cors = require('cors');
// const helmet = require('helmet'); //Para header seguros
// const cookieParser = require('cookie-parser');
// require('dotenv').config();

// //RUTAS APIS
// const loginRoutes = require('./routes/login/loginRoute');
// const usuarioRoutes = require('./routes/usersRoutes');
// const departamentos = require('./routes/departRoutes');
// const verusuarios = require('./routes/gestionycontrol/clientes/clientesRoutes');

// const crearbackup = require('./routes/backup/crearBackupRoutes');

// //usuarios
// const UsuariosRoutes = require('./routes/gestionycontrol/usuarios/usuariosRoutes');
// //equipos
// const EquiposRoutes = require('./routes/gestionycontrol/equipos/equiposRoutes');
// //mecanicos
// const MecanicosRoutes = require('./routes/gestionycontrol/mecanicos/mecanicosRoutes');
// //para listas generales => (Clientes, Paises, Departamentos, Municipios, Sexo, Tipodocumento, )
// const ListarDatosGenerales = require('./routes/generales/GeneralesRoutes');
// //proyectos
// const ProyectosRoutes = require('./routes/gestionycontrol/proyectos/proyectosRoutes');
// //usuarios generales
// const UsuariosGenerales = require('./routes/gestionycontrol/usuariosgenerales/usuariosgeneralesRoutes');
// const app = express();
// //Prevención de ataques
// // app.use(helmet());
// app.use(helmet.hsts({ maxAge: 5184000, includeSubDomains: true }));

// app.use(cookieParser());


// // Middleware para parsear JSON
// app.use(express.json());

// // Configuración de CORS
// const corsOptions = {
//     // origin: '*',
//     origin: 'http://localhost:3001', //Solo peticiones desde el front correcto
//     // origin: process.env.DOMINIO_FRONTEND || 'NADA MORRRR',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//     optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));

// // Usar las rutas
// app.use(loginRoutes);
// app.use('/api', usuarioRoutes);
// app.use('/api', departamentos);
// app.use(verusuarios);
// app.use(crearbackup);
// app.use(UsuariosRoutes);
// app.use(EquiposRoutes);
// app.use(MecanicosRoutes);
// app.use(ListarDatosGenerales);
// app.use(ProyectosRoutes);
// app.use(UsuariosGenerales);



// // Para servir archivos de backup si quieres que puedan descargarse
// app.use('/api/backups', express.static(path.join(__dirname, 'backups_bd')));

// // ✅ __dirname ya está definido en CommonJS, no hace falta calcularlo
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Servidor escuchando en el puerto ${PORT}`);
// });


// SERVER PARA ENTORNO DESARROLLO CON WS
// // server.config.js
// const express = require('express');
// const path = require('path');
// require('dotenv').config();
// const http = require('http');
// // const WebSocket = require('ws');
// const { inicializarWebSocket } = require('./utils/WebSocket');

// const { applyMiddlewares } = require('./server.config'); // << Nuevo archivo con configuraciones
// const app = express();

// // Aplica middlewares globales (seguridad, CORS, cookies, etc.)
// applyMiddlewares(app);

// // Rutas APIS, están definidas en el archivo ./routes/index.js
// const RutasApis = require('./routes');
// RutasApis.forEach(route => app.use(route));
// // ...

// // Rutas públicas o archivos estáticos
// app.use('/api/backups', express.static(path.join(__dirname, 'backups_bd')));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
// // ...

// // Se implementa WebSocket
// // const server = http.createServer(app);
// // const wss = new WebSocket.Server({ server });
// // wss.on('connection', (ws) => {
// //     console.log('🟢 Cliente conectado a WebSocket');

// //     ws.on('message', (message) => {
// //         console.log('📨 Mensaje recibido:', message);

// //         // Echo a todos los clientes
// //         wss.clients.forEach(client => {
// //             if (client.readyState === WebSocket.OPEN) {
// //                 client.send(`Echo: ${message}`);
// //             }
// //         });
// //     });

// //     ws.on('close', () => {
// //         console.log('🔴 Cliente desconectado');
// //     });
// // });

// const server = http.createServer(app);
// inicializarWebSocket(server);
// // ...

// // module.exports = { server, wss };

// // 🚀 Levantar el servidor HTTP + WebSocket
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log(`Servidor HTTP + WebSocket en puerto ${PORT}`);
// });
// // ...

// // // Inicia el servidor
// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => {
// //     console.log(`Servidor corriendo en puerto ${PORT}`);
// // });
// ...


//NUEVA OPCIÓN CON SOCKET.IO
// server.js
const express = require('express');
const path = require('path');
const http = require('http');
const { applyMiddlewares } = require('./server.config'); // middlewares
const RutasApis = require('./routes'); // rutas API
const { Server } = require('socket.io');
const { setSocketServer } = require('./utils/WebSocket'); // util para manejar io global

const app = express();

// Aplica middlewares globales (seguridad, CORS, cookies, etc.)
applyMiddlewares(app);

// Rutas APIs
RutasApis.forEach(route => app.use(route));

// Archivos estáticos o rutas públicas
app.use('/api/backups', express.static(path.join(__dirname, 'backups_bd')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Crear servidor HTTP tradicional
const server = http.createServer(app);

// Inicializar Socket.IO con el servidor HTTP
const io = new Server(server, {
    cors: {
        origin: [
            'http://localhost:3001',
            'https://mi-app.com',
            'http://192.168.0.14:3001',
            'http://127.0.0.1:3001',
            'https://admintecniservicios.com'
        ],
        credentials: true,
    }
});

// Guardar instancia global para usar desde controladores
setSocketServer(io);

// Eventos de conexión Socket.IO
io.on('connection', (socket) => {
    console.log('🟢 Cliente conectado con Socket.IO, id:', socket.id);

    // Ejemplo de recepción de mensaje
    socket.on('mensaje', (data) => {
        console.log('📨 Mensaje recibido:', data);

        // Reenviar a todos los clientes
        io.emit('mensaje', data);
    });

    socket.on('disconnect', (reason) => {
        console.log('🔴 Cliente desconectado:', socket.id, 'Motivo:', reason);
    });
});

// Levantar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor HTTP + Socket.IO escuchando en puerto ${PORT}`);
});