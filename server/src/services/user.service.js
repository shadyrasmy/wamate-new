const { User, Plan } = require('../models');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

/**
 * Finds or creates a local user based on Supabase User data.
 * @param {Object} supabaseUser - User object from Supabase Auth
 * @param {string} [password] - Optional password to sync (hash it)
 * @returns {Promise<User>} Local User instance
 */
const syncUserFromSupabase = async (supabaseUser, password = null) => {
    const email = supabaseUser.email;
    let user = await User.findOne({ where: { email } });

    // Map metadata
    const name = supabaseUser.user_metadata?.username || supabaseUser.user_metadata?.full_name || 'Supabase User';
    const phone = supabaseUser.user_metadata?.phone || supabaseUser.phone || null;

    if (!user) {
        console.log(`[User Sync] Creating users ${email} from Supabase data.`);

        // Generate Identifiers
        const hashedPassword = password ? await bcrypt.hash(password, 12) : await bcrypt.hash(uuidv4(), 12); // Random if no password (middleware case)
        const myReferralCode = crypto.randomBytes(4).toString('hex').toUpperCase();

        // 1. Find PRO plan
        const proPlan = await Plan.findOne({ where: { name: 'Pro' } });
        const targetPlanId = proPlan ? proPlan.id : null;

        if (!targetPlanId) {
            console.warn('[User Sync] "Pro" plan not found. User created without plan or default.');
        }

        user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone_number: phone,
            access_token: uuidv4(),
            email_verified: true,
            verification_token: null,
            referral_code: myReferralCode,
            referral_balance: 0.00,
            id_plan: targetPlanId,
            subscription_start_date: new Date(),
            subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });

    } else {
        // Update existing user to "Pro" if needed or update metadata
        // If password is provided (Controller login), update it.
        if (password) {
            user.password = await bcrypt.hash(password, 12);
        }

        user.email_verified = true;

        const proPlan = await Plan.findOne({ where: { name: 'Pro' } });
        if (proPlan && user.id_plan !== proPlan.id) {
            console.log(`[User Sync] Upgrading ${email} to Pro plan.`);
            user.id_plan = proPlan.id;
            user.subscription_end_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        }

        // Optional: Update name/phone if missing?
        if (!user.phone_number && phone) user.phone_number = phone;

        await user.save();
    }

    return user;
};

module.exports = {
    syncUserFromSupabase
};
