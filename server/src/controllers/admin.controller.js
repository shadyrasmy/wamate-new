const { User, WhatsAppInstance, Plan, Invoice, sequelize, SiteConfig, EmailTemplate, Message, ReferralTransaction } = require('../models');
const { AppError } = require('../middlewares/error.middleware');
const { Op } = require('sequelize');
const emailService = require('../services/email.service');

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
                },
                {
                    model: Plan,
                    as: 'plan',
                    attributes: ['id', 'name']
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
        if (plan) {
            const planDoc = await Plan.findOne({ where: { name: plan } });
            if (planDoc) {
                user.id_plan = planDoc.id;
                // Auto-fill limits if they are not explicitly provided (or if they match the previous plan's defaults)
                // For simplicity, if a plan name is passed, we usually want those limits unless specified otherwise
                if (monthly_message_limit === undefined) user.monthly_message_limit = planDoc.monthly_message_limit;
                if (max_instances === undefined) user.max_instances = planDoc.max_instances;
                if (max_seats === undefined) user.max_seats = planDoc.max_seats;
            }
        }

        if (monthly_message_limit !== undefined) user.monthly_message_limit = monthly_message_limit;
        if (max_instances !== undefined) user.max_instances = max_instances;
        if (max_seats !== undefined) user.max_seats = max_seats;
        if (is_active !== undefined) user.is_active = !!is_active;
        if (subscription_end_date) user.subscription_end_date = subscription_end_date;

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
                { model: Invoice, as: 'invoices', order: [['createdAt', 'DESC']] },
                { model: Plan, as: 'plan' }
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
        const { status } = req.query;

        const whereClause = {};
        if (status && ['pending', 'paid', 'failed', 'cancelled'].includes(status)) {
            whereClause.status = status;
        }

        const { count, rows } = await Invoice.findAndCountAll({
            where: whereClause,
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

// Payment approval imports
const { upgradeUserPlan } = require('./payment.controller');
const referralService = require('../services/referral.service');

exports.approvePayment = async (req, res, next) => {
    try {
        const { invoiceId } = req.params;

        const invoice = await Invoice.findByPk(invoiceId, {
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
        });

        if (!invoice) return next(new AppError('Invoice not found', 404));

        if (invoice.status === 'paid') {
            return res.status(400).json({
                status: 'error',
                message: 'Invoice already paid'
            });
        }

        if (!invoice.plan_id) {
            return next(new AppError('Invoice has no associated plan', 400));
        }

        // Upgrade user plan
        await upgradeUserPlan(invoice.user_id, invoice.plan_id);

        // Update invoice status
        await invoice.update({
            status: 'paid',
            paid_at: new Date()
        });

        // Trigger Referral Commission
        await referralService.processCommission(invoice);

        res.status(200).json({
            status: 'success',
            message: 'Payment approved and user plan upgraded',
            data: { invoice }
        });
    } catch (err) {
        next(err);
    }
};

exports.rejectPayment = async (req, res, next) => {
    try {
        const { invoiceId } = req.params;

        const invoice = await Invoice.findByPk(invoiceId);
        if (!invoice) return next(new AppError('Invoice not found', 404));

        if (invoice.status === 'paid') {
            return res.status(400).json({
                status: 'error',
                message: 'Cannot reject a paid invoice'
            });
        }

        await invoice.update({ status: 'cancelled' });

        res.status(200).json({
            status: 'success',
            message: 'Payment rejected',
            data: { invoice }
        });
    } catch (err) {
        next(err);
    }
};

// USER CONTROL
exports.deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);
        if (!user) return next(new AppError('User not found', 404));

        await user.destroy();
        res.status(200).json({ status: 'success', message: 'User deleted from grid.' });
    } catch (err) {
        next(err);
    }
};

exports.banUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { active } = req.body; // true = active, false = banned

        const user = await User.findByPk(userId);
        if (!user) return next(new AppError('User not found', 404));

        user.is_active = !!active;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: `User access ${user.is_active ? 'RESTORED' : 'RESTRICTED'}.`
        });
    } catch (err) {
        next(err);
    }
};

exports.extendSubscription = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { days } = req.body;

        const user = await User.findByPk(userId);
        if (!user) return next(new AppError('User not found', 404));

        const currentEnd = user.subscription_end_date ? new Date(user.subscription_end_date) : new Date();
        currentEnd.setDate(currentEnd.getDate() + parseInt(days));

        user.subscription_end_date = currentEnd;
        await user.save();

        // Send Purchase Confirmation Email
        try {
            await emailService.sendTemplate(user.email, 'subscription_purchase', {
                name: user.name,
                plan_name: user.plan || 'Premium',
                end_date: currentEnd.toLocaleDateString()
            });
        } catch (error) {
            console.warn('Failed to send purchase confirmation email:', error.message);
        }

        res.status(200).json({
            status: 'success',
            message: 'Temporal sequence extended.',
            data: { end_date: user.subscription_end_date }
        });
    } catch (err) {
        next(err);
    }
};

// SITE CONFIG (CMS & TRACKING)


exports.getSiteConfig = async (req, res, next) => {
    try {
        let config = await SiteConfig.findOne();
        if (!config) {
            config = await SiteConfig.create({});
        }
        res.status(200).json({ status: 'success', data: { config } });
    } catch (err) {
        next(err);
    }
};

exports.updateSiteConfig = async (req, res, next) => {
    try {
        let config = await SiteConfig.findOne();
        if (!config) {
            config = await SiteConfig.create(req.body);
        } else {
            await config.update(req.body);
        }
        res.status(200).json({ status: 'success', data: { config } });
    } catch (err) {
        next(err);
    }
};

exports.getPublicSiteConfig = async (req, res, next) => {
    try {
        let config = await SiteConfig.findOne();
        if (!config) {
            config = await SiteConfig.create({});
        }

        // Return only the non-sensitive public configuration
        const publicConfig = {
            cms_visibility: config.cms_visibility,
            landing_content: config.landing_content,
            fb_pixel_id: config.fb_pixel_id,
            header_scripts: config.header_scripts
        };

        res.status(200).json({
            status: 'success',
            data: { config: publicConfig }
        });
    } catch (err) {
        next(err);
    }
};

exports.testSmtp = async (req, res, next) => {
    try {
        const { to, message } = req.body;
        if (!to) return next(new AppError('Recipient email is required', 400));

        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <h3>SMTP Test - WaMate</h3>
                <p>This is a test email from your WaMate Admin Dashboard.</p>
                <hr />
                <p><strong>Custom Message:</strong></p>
                <p>${message || 'No custom message provided.'}</p>
            </div>
        `;

        await emailService.sendMail(to, 'SMTP Configuration Test', html);

        res.status(200).json({
            status: 'success',
            message: `Test email sent successfully to ${to}`
        });
    } catch (err) {
        next(err);
    }
};

exports.toggleEmailVerification = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { verified } = req.body;

        const user = await User.findByPk(userId);
        if (!user) return next(new AppError('User not found', 404));

        user.email_verified = !!verified;
        if (verified) {
            user.verification_token = null; // Clear token if verified manually
        }
        await user.save();

        res.status(200).json({
            status: 'success',
            message: `User email status set to ${verified ? 'VERIFIED' : 'UNVERIFIED'}.`,
            data: { email_verified: user.email_verified }
        });
    } catch (err) {
        next(err);
    }
};

// EMAIL TEMPLATES
exports.getTemplates = async (req, res, next) => {
    try {
        const templates = await EmailTemplate.findAll({
            attributes: ['key', 'name', 'subject', 'body', 'variables', 'is_active', 'updatedAt']
        });
        res.status(200).json({ status: 'success', data: { templates } });
    } catch (err) {
        next(err);
    }
};

exports.updateTemplate = async (req, res, next) => {
    try {
        const { key } = req.params;
        const { subject, body } = req.body;

        const template = await EmailTemplate.findOne({ where: { key } });
        if (!template) return next(new AppError('Template not found', 404));

        if (subject) template.subject = subject;
        if (body) template.body = body;

        await template.save();

        res.status(200).json({
            status: 'success',
            message: 'Template updated successfully',
            data: { template }
        });
    } catch (err) {
        next(err);
    }
};

exports.getInsights = async (req, res, next) => {
    try {
        const now = new Date();
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // 1. Instance & Connection Stats
        const totalInstances = await WhatsAppInstance.count();
        const onlineInstances = await WhatsAppInstance.count({ where: { status: 'connected' } });

        // 2. Messaging Ecosystem
        const globalSentMessages = await Message.count({ where: { from_me: true } });
        const globalReceivedMessages = await Message.count({ where: { from_me: false } });

        // Message Type Breakdown
        const typeBreakdown = await Message.findAll({
            attributes: ['type', [sequelize.fn('COUNT', sequelize.col('type')), 'count']],
            group: ['type']
        });

        // 3. User Growth & Conversion
        const totalUsers = await User.count();
        const newUsers24h = await User.count({ where: { createdAt: { [Op.gte]: last24h } } });
        const newUsers7d = await User.count({ where: { createdAt: { [Op.gte]: last7d } } });

        const paidUsersCount = await User.count({
            where: {
                id_plan: { [Op.ne]: null },
                subscription_end_date: { [Op.gte]: now }
            }
        });
        const conversionRate = totalUsers > 0 ? (paidUsersCount / totalUsers) * 100 : 0;

        // Churn Risk (Expiring in next 7 days)
        const churnRisk = await User.findAll({
            where: {
                subscription_end_date: {
                    [Op.between]: [now, new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)]
                }
            },
            attributes: ['id', 'name', 'email', 'subscription_end_date'],
            limit: 10
        });

        // 4. Revenue & Plans
        const totalEarningsResult = await Invoice.sum('amount', { where: { status: 'paid' } });
        const totalEarnings = parseFloat(totalEarningsResult || 0);

        // Pending vs Paid Invoices (Last 30 days)
        const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const invoiceStats = await Invoice.findAll({
            where: { createdAt: { [Op.gte]: last30d } },
            attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
            group: ['status']
        });

        // Plan Distribution
        const planDistribution = await User.findAll({
            attributes: [
                [sequelize.literal('COALESCE(plan.name, "Free")'), 'plan_name'],
                [sequelize.fn('COUNT', sequelize.col('User.id')), 'count']
            ],
            include: [{ model: Plan, as: 'plan', attributes: [] }],
            group: ['plan.id', 'plan.name'],
            raw: true
        });

        // MRR Calculation (Approximate)
        const activeSubscriptions = await User.findAll({
            where: {
                id_plan: { [Op.ne]: null },
                subscription_end_date: { [Op.gte]: now }
            },
            include: [{ model: Plan, as: 'plan' }]
        });

        let mrr = 0;
        activeSubscriptions.forEach(user => {
            if (user.plan) {
                if (user.plan.billing_cycle === 'yearly') {
                    mrr += user.plan.price / 12;
                } else {
                    mrr += user.plan.price;
                }
            }
        });

        // 5. Affiliates
        const topReferrers = await ReferralTransaction.findAll({
            attributes: [
                'referrer_id',
                [sequelize.fn('SUM', sequelize.col('amount')), 'total_earned']
            ],
            include: [{ model: User, as: 'referrer', attributes: ['name', 'email'] }],
            group: ['referrer_id', 'referrer.id', 'referrer.name', 'referrer.email'],
            order: [[sequelize.literal('total_earned'), 'DESC']],
            limit: 5
        });

        const totalCommissionsResult = await ReferralTransaction.sum('amount', { where: { type: 'commission' } });
        const totalCommissions = parseFloat(totalCommissionsResult || 0);

        // 6. Performance Tables
        const instances = await WhatsAppInstance.findAll({
            attributes: [
                'id', 'instance_id', 'name', 'status', 'phone_number',
                [
                    sequelize.literal('(SELECT COUNT(*) FROM messages WHERE messages.instance_id = WhatsAppInstance.id AND messages.from_me = true)'),
                    'messages_sent'
                ]
            ],
            include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
            limit: 10,
            order: [[sequelize.literal('messages_sent'), 'DESC']]
        });

        const topUsers = await User.findAll({
            attributes: [
                'id', 'name', 'email',
                [
                    sequelize.literal('(SELECT COUNT(*) FROM messages WHERE messages.user_id = User.id AND messages.from_me = true)'),
                    'messages_sent'
                ]
            ],
            order: [[sequelize.literal('messages_sent'), 'DESC']],
            limit: 10
        });

        res.status(200).json({
            status: 'success',
            data: {
                summary: {
                    totalInstances,
                    onlineInstances,
                    globalSentMessages,
                    globalReceivedMessages,
                    totalEarnings,
                    mrr,
                    totalUsers,
                    newUsers24h,
                    newUsers7d,
                    conversionRate: conversionRate.toFixed(1) + '%',
                    totalCommissions
                },
                messaging: {
                    typeBreakdown,
                },
                revenue: {
                    invoiceStats,
                    planDistribution
                },
                retention: {
                    churnRisk
                },
                affiliates: {
                    topReferrers
                },
                instances,
                topUsers
            }
        });
    } catch (err) {
        next(err);
    }
};
