const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { User } = require('../models');
const { AppError } = require('./error.middleware');

exports.protect = async (req, res, next) => {
    try {
        // 1. Get token
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.query.access_token) {
            token = req.query.access_token;
        }

        if (!token) {
            console.warn(`[Auth] No token provided for ${req.method} ${req.originalUrl}. Headers:`, JSON.stringify(req.headers));
            return next(new AppError('Authentication failed. Please provide a Bearer token or an access_token parameter.', 401));
        }

        // 2. Verify token
        try {
            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

            // 3. User Lookup from JWT
            const { User, Seat } = require('../models');
            console.log(`[Auth] Verifying token for user ID: ${decoded.id}`);
            let user = await User.findByPk(decoded.id);

            if (!user) {
                user = await Seat.findByPk(decoded.id);
                if (user) user.role = 'seat';
            }

            if (!user) return next(new AppError('Account not found.', 401));

            req.user = user;
            return next();
        } catch (err) {
            // 4. Fallback to Static Access Token (UUID) for API Integrations
            if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
                const { User } = require('../models');
                const user = await User.findOne({ where: { access_token: token } });

                if (user) {
                    req.user = user;
                    return next();
                }
            }

            // If both fail, return original JWT error messages
            if (err.name === 'JsonWebTokenError') return next(new AppError('Invalid token. Check your credentials.', 401));
            if (err.name === 'TokenExpiredError') return next(new AppError('Token expired. Use a permanent access_token for integrations.', 401));

            next(err);
        }
    } catch (err) {
        next(err);
    }
};
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide']. role='user'
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
