const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const normalizeOrigin = (value) => {
    if (!value) return value;

    const trimmed = value.trim();
    try {
        const parsed = new URL(trimmed);
        parsed.hostname = parsed.hostname.replace(/\.+$/, '').toLowerCase();
        return parsed.origin;
    } catch {
        return trimmed.replace(/\.+$/, '').replace(/\/+$/, '').toLowerCase();
    }
};

const setupSecurity = (app) => {
    // 1. Helmet for secure HTTP headers
    app.use(helmet());

    // 2. CORS configuration
    const envAllowedOrigins = process.env.CORS_ALLOWED_ORIGINS
        ? process.env.CORS_ALLOWED_ORIGINS.split(',').map(o => o.trim())
        : [];

    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        process.env.FRONTEND_URL,
        process.env.PUBLIC_URL,
        'https://beta.wamateai.online',
        'https://apibeta.wamateai.online',
        ...envAllowedOrigins
    ];
    const validAllowedOrigins = [...new Set(allowedOrigins.map(normalizeOrigin).filter(Boolean))];
    console.log('[Security] Initializing CORS with allowed origins:', validAllowedOrigins);

    const corsOptions = {
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            const normalizedOrigin = normalizeOrigin(origin);

            if (validAllowedOrigins.indexOf(normalizedOrigin) !== -1) {
                callback(null, true);
            } else {
                console.warn(`[CORS] Blocked origin: ${origin}. Normalized: ${normalizedOrigin}. Not in allowed list:`, validAllowedOrigins);
                // Passing false instead of Error prevents Express from crashing the preflight response
                // without headers, which leads to clearer "Blocked by CORS" messages in browser.
                callback(null, false);
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
        credentials: true,
        maxAge: 86400 // 24 hours
    };
    app.use(cors(corsOptions));

    // 3. Rate Limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        standardHeaders: true,
        legacyHeaders: false,
        validate: { trustProxy: false }, // Disable validation check for trust proxy
        message: {
            status: 'error',
            message: 'Too many requests from this IP, please try again after 15 minutes'
        }
    });

    // Apply rate limiting to all requests (can be specific to auth routes later)
    app.use('/api', limiter);
};

module.exports = setupSecurity;
