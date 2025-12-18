const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Seat, User } = require('../models');
const { AppError } = require('../middlewares/error.middleware');

const signToken = (id) => {
    return jwt.sign({ id, role: 'seat' }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

exports.createSeat = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name, email, password } = req.body;

        // Check Limits
        const user = await User.findByPk(userId);
        const seatCount = await Seat.count({ where: { user_id: userId } });

        if (seatCount >= user.max_seats) {
            return next(new AppError('Max seats limit reached for your plan.', 403));
        }

        // Check if email exists (globally or within seats? globally for login simplicity)
        const existingSeat = await Seat.findOne({ where: { email } });
        if (existingSeat) return next(new AppError('Email already used by another seat', 400));

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const seat = await Seat.create({
            user_id: userId,
            name,
            email,
            password: hashedPassword,
            status: 'offline'
        });

        seat.password = undefined;

        res.status(201).json({ status: 'success', data: { seat } });
    } catch (err) {
        next(err);
    }
};

exports.getSeats = async (req, res, next) => {
    try {
        const seats = await Seat.findAll({
            where: { user_id: req.user.id },
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({ status: 'success', data: { seats } });
    } catch (err) {
        next(err);
    }
};

// --- Seat Portal Auth ---

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const seat = await Seat.findOne({ where: { email }, include: [{ model: User, as: 'manager' }] }); // Need association

        if (!seat || !(await bcrypt.compare(password, seat.password))) {
            return next(new AppError('Incorrect email or password', 401));
        }

        const token = signToken(seat.id);
        seat.password = undefined;

        res.status(200).json({ status: 'success', token, data: { seat } });
    } catch (err) {
        next(err);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const seat = await Seat.findByPk(req.user.id); // req.user.id from token
        if (!seat) return next(new AppError('Seat not found', 404));
        seat.password = undefined;
        res.status(200).json({ status: 'success', data: { seat } });
    } catch (err) {
        next(err);
    }
};

exports.deleteSeat = async (req, res, next) => {
    try {
        const seat = await Seat.findOne({ where: { id: req.params.seatId, user_id: req.user.id } });
        if (!seat) return next(new AppError('Seat not found', 404));
        await seat.destroy();
        res.status(204).json({ status: 'success' });
    } catch (err) {
        next(err);
    }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body; // 'online', 'offline', 'busy'
        const seat = await Seat.findByPk(req.user.id);

        if (!seat) return next(new AppError('Seat not found', 404));

        seat.status = status;
        // if status is 'online', update last_active?
        if (status === 'online') seat.last_active = new Date();

        await seat.save();

        res.status(200).json({ status: 'success', data: { seat } });
    } catch (err) {
        next(err);
    }
};
