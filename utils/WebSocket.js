// const WebSocket = require('ws');

// let wss;

// function inicializarWebSocket(server) {
//     wss = new WebSocket.Server({ server });
//     wss.on('connection', (ws) => {
//         console.log('🔌 Cliente WebSocket conectado');
//     });
// }

// function obtenerWebSocketServer() {
//     return wss;
// }

// module.exports = {
//     inicializarWebSocket,
//     obtenerWebSocketServer
// };


let io = null;

const setSocketServer = (ioInstance) => {
    io = ioInstance;
};

const obtenerSocketServer = () => {
    return io;
};

module.exports = {
    setSocketServer,
    obtenerSocketServer,
};
