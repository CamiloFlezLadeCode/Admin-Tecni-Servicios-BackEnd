// server.config.js
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

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

    // Se capturas las cors seguras desde las variables de entorno
    const CorsSeguras = process.env.CORS_SEGURAS_SERVER_CONFIG;
    const CorsSegurasIdividuales = CorsSeguras.split(',');
    // CORS seguro
    const whitelist = [
        // 'https://admin-tecni-servicios.vercel.app'
    ];
    for (let cors = 0; cors < CorsSegurasIdividuales.length; cors++) {
        const element = CorsSegurasIdividuales[cors];
        whitelist.push(element);
    }
    // console.log(whitelist)
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
        // Cuánto puede el navegador reutilizar la respuesta del preflight (OPTIONS).
        // Cada petición lleva `Authorization`, así que sin esto el navegador repetía
        // un OPTIONS antes de CADA petición. Chrome lo limita a 2 horas.
        maxAge: 7200,
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