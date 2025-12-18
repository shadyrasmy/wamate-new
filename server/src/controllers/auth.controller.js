const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AppError } = require('../middlewares/error.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

exports.register = async (req, res, next) => {
    try {
        // 1. Validate Input
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return next(new AppError(error.details[0].message, 400));
        }

        const { name, email, password } = req.body;

        // 2. Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return next(new AppError('Email already in use', 400));
        }

        // 3. Hash Password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // 5. Send Token
        const token = signToken(user.id);

        // Remove password from output
        user.password = undefined;

        res.status(201).json({
            status: 'success',
            token,
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        // 1. Validate Input
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return next(new AppError(error.details[0].message, 400));
        }

        const { email, password } = req.body;

        // 2. Check for user & password
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next(new AppError('Incorrect email or password', 401));
        }

        // 3. Send Token
        const token = signToken(user.id);
        user.password = undefined;

        res.status(200).json({
            status: 'success',
            token,
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);

        user.password = undefined;

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};
