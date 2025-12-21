const { User, ReferralTransaction, SiteConfig, sequelize } = require('../models');
const emailService = require('./email.service');

/**
 * Process referral commission for a paid invoice.
 * @param {Object} invoice - The paid invoice object.
 * @param {Object} [t] - Optional sequelize transaction.
 */
exports.processCommission = async (invoice, t) => {
    try {
        const user = await User.findByPk(invoice.user_id);
        if (!user || !user.referred_by) return;

        const referrer = await User.findByPk(user.referred_by);
        if (!referrer) return;

        // Get Commission Config
        const config = await SiteConfig.findOne();
        const percentage = config ? config.referral_commission_percentage : 20;

        // Calculate Commission
        const commissionAmount = (Number(invoice.amount) * percentage) / 100;

        if (commissionAmount <= 0) return;

        // Execute DB updates
        // If a transaction 't' is provided, use it. Otherwise, create a new one.
        // However, if the caller is already in a transaction, we should use that.
        // Ideally, the caller should pass the transaction if they want atomicity with the invoice update.

        const performUpdates = async (transaction) => {
            // Check if this invoice already triggered a commission to prevent double counting
            // (Optional safety check, though idempotent calls are better handled by logic)
            const existingTx = await ReferralTransaction.findOne({
                where: {
                    note: { [require('sequelize').Op.like]: `%${invoice.invoice_number}%` },
                    type: 'commission'
                },
                transaction
            });

            if (existingTx) {
                console.log(`Referral commission already processed for invoice ${invoice.invoice_number}`);
                return;
            }

            await referrer.increment('referral_balance', { by: commissionAmount, transaction });

            await ReferralTransaction.create({
                referrer_id: referrer.id,
                referred_user_id: user.id,
                amount: commissionAmount,
                percentage: percentage,
                type: 'commission',
                status: 'completed',
                note: `Commission for invoice ${invoice.invoice_number}`
            }, { transaction });
        };

        if (t) {
            await performUpdates(t);
        } else {
            await sequelize.transaction(async (newT) => {
                await performUpdates(newT);
            });
        }

        console.log(`💰 Commission of $${commissionAmount} added to referrer ${referrer.id}`);

        // Send Email (outside transaction to avoid blocking/rollback on email fail)
        try {
            await emailService.sendTemplate(referrer.email, 'referral_earned', {
                name: referrer.name,
                amount: `$${commissionAmount.toFixed(2)}`,
                plan_name: invoice.plan_name
            });
        } catch (emailErr) {
            console.warn('Failed to send referral email:', emailErr.message);
        }

    } catch (error) {
        console.error('Error in processCommission:', error);
        // We generally don't want to throw here and fail the invoice approval, 
        // effectively executing a "best effort" policy for referrals.
        // Unless strict consistency is required, in which case we should propagate the error.
        // For now, logging is safer to prevent blocking paid user access.
    }
};
