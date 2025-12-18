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
            return next(new AppError('Authentication failed. Please provide a Bearer token or an access_token parameter.', 401));
        }

        // 2. Verify token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 3. Check if user still exists (User or Seat)
        const { User, Seat } = require('../models');

        let user = await User.findByPk(decoded.id);

        // If not a user, check if it's a Seat
        if (!user) {
            user = await Seat.findByPk(decoded.id);
            if (user) user.role = 'seat';
        }

        if (!user) {
            return next(new AppError('The user/seat belonging to this token no longer exists.', 401));
        }

        // 4. Grant Access
        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return next(new AppError('Invalid token. Please log in again!', 401));
        }
        if (err.name === 'TokenExpiredError') {
            return next(new AppError('Your token has expired! Please log in again.', 401));
        }
        next(err);
    }
};
