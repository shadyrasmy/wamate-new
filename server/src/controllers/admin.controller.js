const { User, WhatsAppInstance, Plan, Invoice, sequelize } = require('../models');
const { AppError } = require('../middlewares/error.middleware');
const { Op } = require('sequelize');

exports.getAllUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { startDate, endDate, search } = req.query;

        const whereClause = {};
        if (startDate && endDate) {
            whereClause.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await User.findAndCountAll({
            where: whereClause,
            attributes: { exclude: ['password'] },
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: WhatsAppInstance,
                    as: 'instances',
                    attributes: [
                        'id', 'instance_id', 'name', 'status', 'phone_number', 'is_active',
                        [
                            sequelize.literal('(SELECT COUNT(*) FROM messages WHERE messages.instance_id = instances.id AND messages.from_me = true)'),
                            'messages_count'
                        ]
                    ]
                }
            ]
        });

        res.status(200).json({
            status: 'success',
            data: {
                users: rows,
                total: count,
                page,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateUserPlan = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const {
            plan,
            monthly_message_limit,
            max_instances,
            max_seats,
            is_active,
            subscription_end_date
        } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        // Update fields if provided
        if (plan) user.plan = plan;
        if (monthly_message_limit !== undefined) user.monthly_message_limit = monthly_message_limit;
        if (max_instances !== undefined) user.max_instances = max_instances;
        if (max_seats !== undefined) user.max_seats = max_seats;
        if (is_active !== undefined) user.is_active = is_active;
        if (subscription_end_date !== undefined) user.subscription_end_date = subscription_end_date;

        await user.save();

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};

exports.getUserDetails = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: [
                { model: WhatsAppInstance, as: 'instances' },
                { model: Invoice, as: 'invoices', order: [['createdAt', 'DESC']] }
            ]
        });

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};

// Plan Management
exports.getPlans = async (req, res, next) => {
    try {
        const plans = await Plan.findAll({ order: [['price', 'ASC']] });
        res.status(200).json({ status: 'success', data: { plans } });
    } catch (err) {
        next(err);
    }
};

exports.createPlan = async (req, res, next) => {
    try {
        const plan = await Plan.create(req.body);
        res.status(201).json({ status: 'success', data: { plan } });
    } catch (err) {
        next(err);
    }
};

exports.updatePlan = async (req, res, next) => {
    try {
        const { planId } = req.params;
        const plan = await Plan.findByPk(planId);
        if (!plan) return next(new AppError('Plan not found', 404));

        await plan.update(req.body);
        res.status(200).json({ status: 'success', data: { plan } });
    } catch (err) {
        next(err);
    }
};

exports.deletePlan = async (req, res, next) => {
    try {
        const { planId } = req.params;
        const plan = await Plan.findByPk(planId);
        if (!plan) return next(new AppError('Plan not found', 404));

        await plan.destroy();

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};

// Invoice Management
exports.getAllInvoices = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Invoice.findAndCountAll({
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            status: 'success',
            data: {
                invoices: rows,
                total: count,
                page,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (err) {
        next(err);
    }
};
