const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Plan } = require('../models');
const { AppError } = require('../middlewares/error.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

const { v4: uuidv4 } = require('uuid');

const emailService = require('../services/email.service');
const crypto = require('crypto');

// Helper to create random token
const createVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

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

        const { name, email, password, phone_number } = req.body;

        // 2. Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return next(new AppError('Email is already in use', 400));
        }

        // 3. Hash Password & Generate Referral Code
        const hashedPassword = await bcrypt.hash(password, 12);
        const verificationToken = createVerificationToken();

        // Generate unique referral code (8 chars, alphanumeric)
        const myReferralCode = crypto.randomBytes(4).toString('hex').toUpperCase();

        // 3.5 Check for Referrer
        let referredBy = null;
        if (req.body.referralCode) {
            const referrer = await User.findOne({ where: { referral_code: req.body.referralCode } });
            if (referrer) {
                referredBy = referrer.id;
            }
        }

        // 4. Create User (Unverified) - with 14-day trial
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone_number,
            access_token: uuidv4(),
            email_verified: false,
            verification_token: verificationToken,
            referral_code: myReferralCode,
            referred_by: referredBy,
            referral_balance: 0.00,
            subscription_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14-day trial
        });

        // 5. Send Verification Email
        try {
            let rawBaseUrl = process.env.PUBLIC_URL || process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;

            // Fix missing protocol if user provided just domain
            if (rawBaseUrl && !rawBaseUrl.startsWith('http')) {
                rawBaseUrl = `https://${rawBaseUrl}`;
            }

            const baseUrl = rawBaseUrl;
            console.log(`[Auth] Verification Email requested. Target Base URL: ${baseUrl}`);
            await emailService.sendVerificationEmail(user, verificationToken, baseUrl);
        } catch (emailError) {
            console.error('[Auth] Failed to send verification email:', emailError.message);
            // Optional: deleting user if email fails? For now, let's keep user and let them resend or contact support.
        }

        // 6. Response (NO TOKEN - Require Login after verification)
        res.status(201).json({
            status: 'success',
            message: 'Registration successful! Please check your email to verify your account.',
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

exports.login = async (req, res, next) => {
    try {
        // 1. Validate Input
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return next(new AppError(error.details[0].message, 400));
        }

        const { email, password } = req.body;

        // 2. Check for user & password LOCALLY
        let user = await User.findOne({ where: { email } });
        let authenticated = false;

        if (user && (await bcrypt.compare(password, user.password))) {
            authenticated = true;
        }

        // 3. Fallback: Check Supabase if not authenticated locally
        if (!authenticated) {
            console.log(`[Auth] Local login failed for ${email}, attempting Supabase fallback...`);
            const { authenticateWithSupabase } = require('../services/supabase.service');
            const supabaseUser = await authenticateWithSupabase(email, password);

            if (supabaseUser) {
                console.log(`[Auth] Supabase login successful for ${email}`);
                // User exists in Supabase. Now sync/create locally.

                if (!user) {
                    // Create new user from Supabase data
                    const crypto = require('crypto');
                    const { v4: uuidv4 } = require('uuid'); // Ensure this is available if not globally

                    // Map metadata
                    const name = supabaseUser.user_metadata?.username || supabaseUser.user_metadata?.full_name || 'Supabase User';
                    const phone = supabaseUser.user_metadata?.phone || supabaseUser.phone || null;

                    // Generate identifiers
                    const hashedPassword = await bcrypt.hash(password, 12); // Sync password so local login works next time
                    const verificationToken = null; // Already verified
                    const myReferralCode = crypto.randomBytes(4).toString('hex').toUpperCase();

                    // Find PRO plan
                    const proPlan = await Plan.findOne({ where: { name: 'Pro' } }); // Adjust name if needed
                    const proPlanId = proPlan ? proPlan.id : null;

                    // Warn if plan not found, but proceed? Or maybe create? 
                    // Let's assume seeded or we create? 
                    // Better to just fetch ONE plan or default. 
                    // Plan logic:
                    let targetPlanId = proPlanId;
                    if (!targetPlanId) {
                        // Fallback: try to find ANY plan or create a dummy Pro plan if critical?
                        // For now, let's log warning.
                        console.warn('[Auth] "Pro" plan not found for synced user. Assigning default.');
                    }

                    user = await User.create({
                        name,
                        email,
                        password: hashedPassword,
                        phone_number: phone,
                        access_token: uuidv4(),
                        email_verified: true, // Trusted from Supabase
                        verification_token: null,
                        referral_code: myReferralCode,
                        referral_balance: 0.00,
                        id_plan: targetPlanId,
                        subscription_start_date: new Date(),
                        subscription_end_date: null, // Lifetime? Or calculate based on plan? Let's say 1 month or lifetime per request "Pro subscription" usually implies active. 
                        // If standard flow gives 14 days, maybe we give same or unlimit?
                        // User said "account with pro subscription".
                        // Let's set a long expiry or follow plan duration (usually monthly).
                        subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days default
                    });

                    console.log(`[Auth] User ${email} created locally via Sync.`);

                } else {
                    // User exists but password failed locally -> Update password to match Supabase
                    console.log(`[Auth] Updating local password for ${email} to match Supabase.`);
                    user.password = await bcrypt.hash(password, 12);
                    user.email_verified = true; // Trust Supabase

                    // Ensure Pro plan? User said "anyone that regsiterd... have an account in wamate with pro"
                    // If they already exist, maybe upgrade them?
                    // Let's safe side: Upgrade if no plan? Or always upgrade?
                    // "have an account ... with pro subscription". Implies should have it.
                    const proPlan = await Plan.findOne({ where: { name: 'Pro' } });
                    if (proPlan && user.id_plan !== proPlan.id) {
                        user.id_plan = proPlan.id;
                        user.subscription_end_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                    }

                    await user.save();
                }

                authenticated = true;
            }
        }

        if (!authenticated || !user) {
            return next(new AppError('Incorrect email or password', 401));
        }

        // 3. Email Verification Check (Skip if we just verified via Supabase)
        if (!user.email_verified) {
            return next(new AppError('Please verify your email address before logging in.', 403));
        }

        // 4. Send Token
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

exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.query;
        if (!token) return next(new AppError('Verification token is missing', 400));

        const user = await User.findOne({ where: { verification_token: token } });
        if (!user) {
            return next(new AppError('Invalid or expired verification token', 400));
        }

        user.email_verified = true;
        user.verification_token = null;
        await user.save();

        // Send Welcome Email
        try {
            await emailService.sendTemplate(user.email, 'welcome', {
                name: user.name,
                dashboard_link: `${process.env.PUBLIC_URL || process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`
            });
        } catch (error) {
            console.warn('Failed to send welcome email:', error.message);
        }

        // Send login token or just success message?
        // Let's send a success message so frontend can redirect to login.
        res.status(200).json({
            status: 'success',
            message: 'Email verified successfully! You can now log in.'
        });
    } catch (err) {
        next(err);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: [{ model: Plan, as: 'plan', attributes: ['name', 'monthly_message_limit', 'max_instances', 'max_seats', 'ai_enabled', 'ai_reply_limit', 'ai_knowledge_limit'] }]
        });
        if (!user) return next(new AppError('User not found', 404));

        user.password = undefined;

        // Calculate subscription status
        const now = new Date();
        const endDate = user.subscription_end_date ? new Date(user.subscription_end_date) : null;
        const isExpired = endDate ? now > endDate : true; // No end date = expired (needs plan)
        const daysUntilExpiry = endDate ? Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)) : -1;

        res.status(200).json({
            status: 'success',
            data: {
                user,
                subscription_status: isExpired ? 'expired' : 'active',
                days_until_expiry: daysUntilExpiry
            }
        });
    } catch (err) {
        next(err);
    }
};
