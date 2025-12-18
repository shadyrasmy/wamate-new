const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const setupSecurity = (app) => {
    // 1. Helmet for secure HTTP headers
    app.use(helmet());

    // 2. CORS configuration
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', process.env.FRONTEND_URL];
    const corsOptions = {
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            // Filter out undefined/null from allowedOrigins before checking
            const validAllowedOrigins = allowedOrigins.filter(Boolean);
            if (validAllowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                console.log('Blocked CORS:', origin);
                callback(new Error('Not allowed by CORS')); // Block if not in allowed list
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
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
        message: {
            status: 'error',
            message: 'Too many requests from this IP, please try again after 15 minutes'
        }
    });

    // Apply rate limiting to all requests (can be specific to auth routes later)
    app.use('/api', limiter);
};

module.exports = setupSecurity;
