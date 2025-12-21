const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
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

        // 4. Create User (Unverified)
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
            referral_balance: 0.00
        });

        // 5. Send Verification Email
        try {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            await emailService.sendVerificationEmail(user, verificationToken, baseUrl);
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
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

        // 2. Check for user & password
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next(new AppError('Incorrect email or password', 401));
        }

        // 3. Email Verification Check
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
        const user = await User.findByPk(req.user.id);
        if (!user) return next(new AppError('User not found', 404));

        user.password = undefined;

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};
