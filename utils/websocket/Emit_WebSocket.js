const { obtenerSocketServer } = require('../WebSocket');

function emitirWebSocketDevolucion() {
    return {
        devolucionEliminada: async (IdDevolucion) => {
            const io = obtenerSocketServer();
            if (io) {
                io.emit('devolucion-eliminada', IdDevolucion);
            } else {
                console.warn("⚠️ Socket.IO no está inicializado");
            }
        },
        devolucionActualizada: async (IdDevolucion) => {
            const io = obtenerSocketServer();
            if (io) {
                io.emit('devolucion-actualizada', IdDevolucion);
            } else {
                console.warn("⚠️ Socket.IO no está inicializado");
            }
        },
        devolucionCreada: async (IdDevolucion) => {
            const io = obtenerSocketServer();
            if (io) {
                io.emit('devolucion-creada', IdDevolucion);
            } else {
                console.warn("⚠️ Socket.IO no está inicializado");
            }
        },
    }
};
module.exports = {
    emitirWebSocketDevolucion
};
