const pino = require('pino');
const logger = pino({ level: process.env.NODE_ENV === 'production' ? 'info' : 'debug' });

// Custom Error Class
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Global Error Handler
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        logger.error({ err }, 'Error occurred');
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // Production
        // Force 4xx errors to be operational if they aren't explicitly marked
        if (err.isOperational || (err.statusCode >= 400 && err.statusCode < 500)) {
            // Trusted error: send message to client
            res.status(err.statusCode).json({
                status: err.status || 'fail',
                message: err.message
            });
        } else {
            // Programming or other unknown error: don't leak details
            logger.error({ err }, 'Unexpected Error');
            res.status(500).json({
                status: 'error',
                message: 'Something went very wrong!'
            });
        }
    }
};

module.exports = { AppError, errorHandler };
