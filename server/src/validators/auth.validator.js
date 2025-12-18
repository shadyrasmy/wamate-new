const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required()
        .messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
            'string.min': 'Password must be at least 8 characters long'
        })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = {
    registerSchema,
    loginSchema
};
