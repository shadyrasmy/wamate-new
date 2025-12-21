const cron = require('node-cron');
const { User, Plan } = require('../models');
const emailService = require('./email.service');
const { Op } = require('sequelize');

class CronService {
    constructor() {
        this.startExpiryCheck();
    }

    startExpiryCheck() {
        // Runs every day at 00:00 (Midnight)
        cron.schedule('0 0 * * *', async () => {
            console.log('[CronService] Running daily subscription expiry check...');
            await this.processExpirations();
        });
    }

    async processExpirations() {
        try {
            const today = new Date();
            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(today.getDate() + 7);

            // 1. Send Warning for subscriptions ending in exactly 7 days
            const warningUsers = await User.findAll({
                where: {
                    subscription_end_date: {
                        [Op.lte]: sevenDaysFromNow,
                        [Op.gt]: today
                    },
                    last_expiry_warning_sent: null,
                    is_active: true
                }
            });

            for (const user of warningUsers) {
                try {
                    const daysLeft = Math.ceil((new Date(user.subscription_end_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                    await emailService.sendTemplate(user.email, 'subscription_expiring', {
                        name: user.name,
                        days: daysLeft.toString(),
                        dashboard_link: `${process.env.PUBLIC_URL || process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`
                    });

                    user.last_expiry_warning_sent = today;
                    await user.save();
                    console.log(`[CronService] Warning email sent to ${user.email}`);
                } catch (err) {
                    console.error(`[CronService] Failed to send warning to ${user.email}:`, err.message);
                }
            }

            // 2. Notify users whose subscription just expired
            const expiredUsers = await User.findAll({
                where: {
                    subscription_end_date: {
                        [Op.lt]: today
                    },
                    is_active: true // Or some other flag for "suspended"
                }
            });

            for (const user of expiredUsers) {
                // Here you might also want to set user.is_active = false or similar
                // But typically you just notify them and restrict access in code (already done in some middlewares?)
                try {
                    await emailService.sendTemplate(user.email, 'subscription_ended', {
                        name: user.name,
                        dashboard_link: `${process.env.PUBLIC_URL || process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`
                    });

                    // We don't want to spam this every day if they remain expired
                    // Maybe use a flag or just one-time check
                    console.log(`[CronService] Expiry email sent to ${user.email}`);
                } catch (err) {
                    console.error(`[CronService] Failed to send expiry notification to ${user.email}:`, err.message);
                }
            }

        } catch (error) {
            console.error('[CronService] Error in processExpirations:', error);
        }
    }
}

module.exports = new CronService();
