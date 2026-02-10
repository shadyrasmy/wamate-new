const nodemailer = require('nodemailer');
const { SiteConfig, EmailTemplate } = require('../models');

class EmailService {
    async getTransporter() {
        const config = await SiteConfig.findOne();
        if (!config || !config.smtp_settings) {
            throw new Error('SMTP settings not configured.');
        }

        const settings = config.smtp_settings;

        return nodemailer.createTransport({
            host: settings.host,
            port: settings.port,
            secure: settings.secure, // true for 465, false for other ports
            auth: {
                user: settings.user,
                pass: settings.password
            }
        });
    }

    async sendMail(to, subject, html) {
        try {
            const config = await SiteConfig.findOne();
            const transporter = await this.getTransporter();
            const settings = config.smtp_settings;

            const info = await transporter.sendMail({
                from: `"${settings.from_name || 'WaMate'}" <${settings.from_email || settings.user}>`,
                to,
                subject,
                html
            });

            console.log(`[EmailService] Sent email to ${to}: ${info.messageId}`);
            return info;
        } catch (error) {
            console.error('[EmailService] Error sending email:', error);
            throw error;
        }
    }



    async sendVerificationEmail(user, token, baseUrl = null) {
        const linkBase = baseUrl || process.env.PUBLIC_URL || 'http://localhost:3000';
        const verificationLink = `${linkBase}/auth/verify-email?token=${token}`;

        try {
            // Try to use template first
            await this.sendTemplate(user.email, 'verification', {
                name: user.name,
                link: verificationLink,
                code: token
            });
        } catch (error) {
            console.warn('[EmailService] Template send failed, falling back to hardcoded:', error.message);
            // Fallback
            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Welcome to WaMate, ${user.name}!</h2>
                    <p>Please verify your email address.</p>
                    <p><a href="${verificationLink}">Verify Email</a></p>
                </div>
            `;
            await this.sendMail(user.email, 'Verify your email - WaMate', html);
        }
    }

    async sendPasswordResetEmail(user, resetLink, code) {
        try {
            // Try to use template first
            await this.sendTemplate(user.email, 'password_reset', {
                name: user.name,
                reset_link: resetLink,
                code: code
            });
        } catch (error) {
            console.warn('[EmailService] Template send failed, falling back to hardcoded:', error.message);
            // Fallback
            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Password Reset Request</h2>
                    <p>Hi ${user.name},</p>
                    <p>We received a request to reset your password. Click the button below to create a new password:</p>
                    <p><a href="${resetLink}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
                    <p>Or use this reset code: <strong>${code}</strong></p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, you can ignore this email.</p>
                </div>
            `;
            await this.sendMail(user.email, 'Password Reset Request - WaMate', html);
        }
    }

    async sendTemplate(to, templateKey, variables = {}) {
        const template = await EmailTemplate.findOne({ where: { key: templateKey, is_active: true } });
        if (!template) throw new Error(`Template '${templateKey}' not found`);

        let { subject, body } = template;

        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            body = body.replace(regex, value);
            subject = subject.replace(regex, value);
        }

        return this.sendMail(to, subject, body);
    }
}

module.exports = new EmailService();
