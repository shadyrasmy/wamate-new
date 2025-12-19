const { User, Plan } = require('../models');
const { AppError } = require('../middlewares/error.middleware');

exports.getProfile = async (req, res, next) => {
    try {
        // If it's a SEAT user, handle differently
        if (req.user.role === 'seat') {
            const { Seat, User } = require('../models');
            const seat = await Seat.findByPk(req.user.id, {
                include: [{ model: User, as: 'manager', attributes: ['name', 'email'] }]
            });
            if (!seat) return next(new AppError('Seat not found', 404));
            return res.status(200).json({ status: 'success', data: { user: seat } });
        }

        // Standard User Profile
        let user;
        try {
            user = await User.findByPk(req.user.id, {
                attributes: ['id', 'name', 'email', 'access_token', 'max_instances', 'monthly_message_limit', 'messages_sent_current_period', 'role'],
                include: [{ model: Plan, as: 'plan', attributes: ['name', 'price'] }]
            });
        } catch (queryErr) {
            console.error('[CRITICAL] Profile Fetch Failed with Association. Falling back to basic fetch.', queryErr.message);
            // Fallback: This handles cases where 'id_plan' or the Plan table is missing in an outdated DB schema
            user = await User.findByPk(req.user.id, {
                attributes: ['id', 'name', 'email', 'access_token', 'max_instances', 'monthly_message_limit', 'messages_sent_current_period', 'role']
            });
        }

        if (!user) return next(new AppError('User not found', 404));

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const { name } = req.body;
        const user = await User.findByPk(req.user.id);

        if (name) user.name = name;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            }
        });
    } catch (err) {
        next(err);
    }
};
