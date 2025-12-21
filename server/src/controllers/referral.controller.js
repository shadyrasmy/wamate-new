const { User, ReferralTransaction, SiteConfig } = require('../models');
const { AppError } = require('../middlewares/error.middleware');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');

// --- User Endpoints ---

exports.getStats = async (req, res, next) => {
    try {
        const crypto = require('crypto');
        let user = await User.findByPk(req.user.id, {
            attributes: ['id', 'referral_code', 'referral_balance']
        });

        // 1. Generate code for legacy users if missing
        if (!user.referral_code) {
            user.referral_code = crypto.randomBytes(4).toString('hex').toUpperCase();
            await user.save();
        }

        // Get total earnings (sum of all 'commission' transactions)
        const totalEarnings = await ReferralTransaction.sum('amount', {
            where: {
                referrer_id: req.user.id,
                type: 'commission'
            }
        }) || 0;

        // Get referral count
        const referralCount = await User.count({
            where: { referred_by: req.user.id }
        });

        // Get recent history
        const history = await ReferralTransaction.findAll({
            where: { referrer_id: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 20,
            include: [
                { model: User, as: 'referred_user', attributes: ['name', 'email'] } // Mask email in frontend
            ]
        });

        // Sanitize history (Mask emails)
        const sanitizedHistory = history.map(tx => {
            const plainTx = tx.get({ plain: true });
            if (plainTx.referred_user && plainTx.referred_user.email) {
                const [local, domain] = plainTx.referred_user.email.split('@');
                const maskedLocal = local.length > 2 ? `${local.slice(0, 2)}***` : `${local}***`;
                plainTx.referred_user.email = `${maskedLocal}@${domain}`;
            }
            return plainTx;
        });

        res.status(200).json({
            status: 'success',
            data: {
                referral_code: user.referral_code,
                balance: user.referral_balance,
                total_earnings: totalEarnings,
                referral_count: referralCount,
                history: sanitizedHistory
            }
        });
    } catch (err) {
        next(err);
    }
};

// --- Admin Endpoints ---

exports.adminGetStats = async (req, res, next) => {
    try {
        // Global Stats
        const totalCommissions = await ReferralTransaction.sum('amount', { where: { type: 'commission' } }) || 0;
        const totalPayouts = await ReferralTransaction.sum('amount', { where: { type: 'payout' } }) || 0;

        // Get Config
        const config = await SiteConfig.findOne();
        const currentPercentage = config ? config.referral_commission_percentage : 20;

        // Top Referrers
        const topReferrers = await User.findAll({
            where: { referral_balance: { [Op.gt]: 0 } },
            order: [['referral_balance', 'DESC']],
            limit: 50,
            attributes: ['id', 'name', 'email', 'referral_code', 'referral_balance']
        });

        res.status(200).json({
            status: 'success',
            data: {
                total_commissions: totalCommissions,
                total_payouts: totalPayouts,
                commission_percentage: currentPercentage,
                top_referrers: topReferrers
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.adminUpdateSettings = async (req, res, next) => {
    try {
        const { percentage } = req.body;
        if (percentage === undefined || percentage < 0 || percentage > 100) {
            return next(new AppError('Invalid percentage', 400));
        }

        let config = await SiteConfig.findOne();
        if (!config) {
            config = await SiteConfig.create({ referral_commission_percentage: percentage });
        } else {
            config.referral_commission_percentage = percentage;
            await config.save();
        }

        res.status(200).json({ status: 'success', message: 'Settings updated' });
    } catch (err) {
        next(err);
    }
};

exports.adminAdjustBalance = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { userId, amount, type, note } = req.body; // type: 'payout' or 'adjustment'

        if (!userId || !amount || !type) {
            return next(new AppError('Missing required fields', 400));
        }

        const user = await User.findByPk(userId);
        if (!user) return next(new AppError('User not found', 404));

        // Create transaction record
        // Note: For payout, amount is usually negative conceptually, but we store absolute amount and type differentiates.
        // Logic: 
        // If type 'payout', we reduce balance. Amount should be positive in request.
        // If type 'adjustment', we can add (positive) or remove (negative).

        let adjustment = parseFloat(amount);
        if (type === 'payout') {
            adjustment = -Math.abs(adjustment);
        }

        // Update User Balance
        user.referral_balance = parseFloat(user.referral_balance) + adjustment;
        await user.save({ transaction: t });

        // Log Transaction
        await ReferralTransaction.create({
            referrer_id: userId,
            referred_user_id: req.user.id, // Admin doing the action
            amount: Math.abs(adjustment),
            percentage: 0,
            type: type,
            status: 'completed',
            note: note || 'Admin Adjustment'
        }, { transaction: t });

        await t.commit();

        res.status(200).json({ status: 'success', data: { new_balance: user.referral_balance } });
    } catch (err) {
        await t.rollback();
        next(err);
    }
};
