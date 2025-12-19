const { AppError } = require('./error.middleware');

exports.validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const message = error.details.map(i => i.message).join(', ');
            return next(new AppError(message, 400));
        }
        next();
    };
};
