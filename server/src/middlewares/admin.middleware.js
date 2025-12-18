const { AppError } = require('./error.middleware');

exports.requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return next(new AppError('Access denied. Admin privileges required.', 403));
    }
    next();
};
