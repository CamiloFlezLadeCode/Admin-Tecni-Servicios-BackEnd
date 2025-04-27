const express = require('express');
const path = require('path');
const cors = require('cors');
const usuarioRoutes = require('./routes/usersRoutes');
const departamentos = require('./routes/departRoutes');
const verusuarios = require('./routes/gestionycontrol/clientesRoutes');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configuración de CORS
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Usar las rutas
app.use('/api', usuarioRoutes);
app.use('/api', departamentos);
app.use(verusuarios);

// ✅ __dirname ya está definido en CommonJS, no hace falta calcularlo
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
