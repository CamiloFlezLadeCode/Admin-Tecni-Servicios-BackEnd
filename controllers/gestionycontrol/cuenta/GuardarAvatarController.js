const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { obtenerSocketServer } = require('../../../utils/WebSocket');

// Crear carpeta si no existe
const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads/avatar');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configuración de almacenamiento con nombre único
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         const uniqueName = `${Date.now()}-${file.originalname}`;
//         cb(null, uniqueName);
//     },
// });
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const nombreAvatar = req.query.nombre; // ✅ Usar query param
        if (!nombreAvatar) {
            return cb(new Error('Falta el nombre del avatar'));
        }
        cb(null, nombreAvatar);
    },
});



// Middleware de multer
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const tiposPermitidos = ['image/png', 'image/jpeg', 'image/jpg', 'image/x-icon'];
        if (tiposPermitidos.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes PNG, JPG e ICO'));
        }
    },
}).single('imagen');

// Método del controlador
const GuardarAvatarController = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('Error al subir imagen:', err.message);
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No se envió ningún archivo' });
        }

        const rutaImagen = `/uploads/avatar/${req.file.filename}`;
        // Se emite el evento Socket al cliente
        const io = obtenerSocketServer();
        if (io) {
            io.emit('avatar-guardado', rutaImagen);
        } else {
            console.warn("⚠️ Socket.IO no está inicializado");
        }
        // ...

        return res.status(200).json({
            mensaje: 'Imagen subida con éxito',
            ruta: rutaImagen,
        });
    });
};

module.exports = {
    GuardarAvatarController,
};
