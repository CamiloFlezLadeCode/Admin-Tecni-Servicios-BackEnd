const express = require('express');
const path = require('path');
const http = require('http');
const { applyMiddlewares } = require('./server.config'); // middlewares
const RutasApis = require('./routes'); // rutas API
const { Server } = require('socket.io');
const { setSocketServer, obtenerSocketServer } = require('./utils/WebSocket'); // util para manejar io global
require('dotenv').config();

const app = express();

app.set('trust proxy', true);

// 👇 Esto debe ir ANTES de cualquier otra ruta
// app.use(
//     '/uploads',
//     (req, res, next) => {
//         res.setHeader('Access-Control-Allow-Origin', process.env.DOMINIO_FRONTEND);
//         res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
//         next();
//     },
//     express.static(path.join(__dirname, 'uploads'))
// );

app.use(
    '/uploads',
    (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', process.env.DOMINIO_FRONTEND);
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); // Opcional pero útil
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); // Opcional
        next();
    },
    express.static(path.join(__dirname, 'uploads'))
);



// Aplica middlewares globales (seguridad, CORS, cookies, etc.)
applyMiddlewares(app);

// Rutas APIs
RutasApis.forEach(route => app.use(route));

// Archivos estáticos o rutas públicas
app.use('/api/backups', express.static(path.join(__dirname, 'backups_bd')));
// app.use('/uploads/avatar', express.static(path.join(__dirname, 'uploads/avatar')));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (req, res) => {
    const forwardedFor = req.headers['x-forwarded-for'];
    const io = obtenerSocketServer();
    const socketClients =
        typeof io?.engine?.clientsCount === 'number'
            ? io.engine.clientsCount
            : typeof io?.of === 'function'
                ? io.of('/').sockets.size
                : typeof io?.sockets?.sockets?.size === 'number'
                    ? io.sockets.sockets.size
                    : null;
    res.status(200).json({
        ok: true,
        status: 'ok',
        now: new Date().toISOString(),
        uptimeSeconds: Math.round(process.uptime()),
        ip: req.ip || null,
        ips: Array.isArray(req.ips) ? req.ips : [],
        remoteAddress: req.socket?.remoteAddress || null,
        forwardedFor: typeof forwardedFor === 'string' ? forwardedFor : null,
        userAgent: req.headers['user-agent'] || null,
        socketClients
    });
});

app.get('/whoami', (req, res) => {
    const forwardedFor = req.headers['x-forwarded-for'];
    res.status(200).json({
        ip: req.ip || null,
        ips: Array.isArray(req.ips) ? req.ips : [],
        remoteAddress: req.socket?.remoteAddress || null,
        forwardedFor: typeof forwardedFor === 'string' ? forwardedFor : null,
        userAgent: req.headers['user-agent'] || null
    });
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Crear servidor HTTP tradicional
const server = http.createServer(app);

// Inicializar Socket.IO con el servidor HTTP
const OrigenesSeguros = process.env.ORIGENES_SEGUROS_PARA_SOCKET_IO_SERVER;
const OrignesSegurosIndividuales = OrigenesSeguros.split(',');
// console.log(OrignesSegurosIndividuales);
// const io = new Server(server, {
//     cors: {
//         origin: OrignesSegurosIndividuales,
//         credentials: true,
//     }
// });

/** Configuración de WebSocket para evitar en lo posible que haya desconexiones inesperadas */
const io = new Server(server, {
    cors: {
        origin: OrignesSegurosIndividuales,
        credentials: true,
    },
    // 🔹 TRANSPORTES (importante que coincida con el frontend)
    transports: ['websocket', 'polling'], // Mantener ambos por compatibilidad

    // 🔹 RECONEXIÓN Y RECUPERACIÓN DE ESTADO (Socket.IO v4+)
    connectionStateRecovery: {
        // La recuperación de estado es CRUCIAL para no perder datos
        maxDisconnectionDuration: 1 * 60 * 1000, // 1 minutos máximo
        skipMiddlewares: false,
    },

    // 🔹 TIMEOUTS OPTIMIZADOS
    // pingTimeout: 30000,           // 30 segundos - tiempo para considerar desconectado
    // pingInterval: 15000,          // 15 segundos - frecuencia de ping
    connectTimeout: 45000,        // 45 segundos - tiempo máximo para conectar

    // 🔹 COMPRESIÓN Y OPTIMIZACIÓN
    perMessageDeflate: {
        threshold: 1024,          // Comprimir mensajes mayores a 1KB
    },
    httpCompression: true,
    maxHttpBufferSize: 1e7,       // 10MB - aumentar para grandes payloads

    // 🔹 UPGRADES Y COMPATIBILIDAD
    allowUpgrades: true,          // Permitir upgrade de polling a websocket
    allowEIO3: false,             // Solo Engine.IO 4+

    // 🔹 ADAPTATIVIDAD (importante para redes móviles)
    upgradeTimeout: 10000,        // 10 segundos para upgrade
    cookie: {
        name: 'io',
        path: '/',
        httpOnly: true,
        sameSite: 'lax'           // Importante para CORS con credenciales
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
