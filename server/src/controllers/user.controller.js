const { User, Plan } = require('../models');
const { AppError } = require('../middlewares/error.middleware');

exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email', 'access_token', 'max_instances', 'monthly_message_limit', 'messages_sent_current_period', 'role'],
            include: [{ model: Plan, as: 'plan', attributes: ['name', 'price'] }]
        });

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
