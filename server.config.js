// server.config.js
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const applyMiddlewares = (app) => {
    // Seguridad con Helmet
    app.use(helmet({
        contentSecurityPolicy: false,
    }));

    // HSTS
    app.use(helmet.hsts({ maxAge: 5184000, includeSubDomains: true }));

    // Cookies y parsing
    app.use(cookieParser());
    app.use(require('express').json());

    // CORS seguro
    const whitelist = [
        'http://localhost:3001',
        'https://mi-app.com',
        'http://192.168.0.14:3001',
        'http://127.0.0.1:3001',
        'https://admintecniservicios.com',
        // 'https://admin-tecni-servicios.vercel.app'
    ];
    const corsOptions = {
        origin: (origin, callback) => {
            if (!origin || whitelist.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('No permitido por CORS'));
            }
        },
        credentials: true,
        optionsSuccessStatus: 200,
    };
    app.use(cors(corsOptions));

    // Limitar peticiones
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 30000,
        message: 'Demasiadas peticiones, intenta más tarde.',
    }));

    // Compresión GZIP
    app.use(compression());

    // Logging
    app.use(morgan('dev'));

    // Trust proxy (si usas proxy reverso como NGINX o servicios en la nube)
    app.set('trust proxy', 1);
};

module.exports = { applyMiddlewares };