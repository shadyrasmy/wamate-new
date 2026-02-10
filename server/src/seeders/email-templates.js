const { EmailTemplate } = require('../models');

const DEFAULT_TEMPLATES = [
    {
        key: 'verification',
        name: 'Email Verification',
        subject: 'Verify your email - WaMate',
        body: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
    <h2 style="color: #4F46E5;">Welcome to WaMate!</h2>
    <p>Please verify your email address to activate your account.</p>
    <p><a href="{{link}}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a></p>
    <p>Or verify using this code: <strong>{{code}}</strong></p>
    <p>If you didn't request this, you can ignore this email.</p>
</div>`,
        variables: ['{{link}}', '{{code}}']
    },
    {
        key: 'welcome',
        name: 'Welcome Email',
        subject: 'Welcome to WaMate!',
        body: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
    <h2 style="color: #4F46E5;">Welcome Aboard, {{name}}!</h2>
    <p>We are thrilled to have you with us. WaMate is your new superpower on WhatsApp.</p>
    <p>Get started by connecting your first instance.</p>
    <p><a href="{{dashboard_link}}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a></p>
</div>`,
        variables: ['{{name}}', '{{dashboard_link}}']
    },
    {
        key: 'subscription_purchase',
        name: 'Subscription Purchase',
        subject: 'Subscription Confirmed - WaMate',
        body: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
    <h2 style="color: #10B981;">Order Confirmed!</h2>
    <p>Hi {{name}},</p>
    <p>Thank you for subscribing to the <strong>{{plan_name}}</strong> plan with WaMate.</p>
    <p>Your subscription is now active until <strong>{{end_date}}</strong>.</p>
    <p>Enjoy your premium features!</p>
</div>`,
        variables: ['{{name}}', '{{plan_name}}', '{{end_date}}']
    },
    {
        key: 'subscription_expiring',
        name: 'Subscription Expiring Soon',
        subject: 'Action Required: Subscription Expiring in {{days}} days',
        body: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
    <h2 style="color: #F59E0B;">Subscription Expiring Soon</h2>
    <p>Hi {{name}},</p>
    <p>This is a reminder that your WaMate subscription will expire in <strong>{{days}} days</strong>.</p>
    <p>To avoid service interruption, please renew your plan soon.</p>
    <p><a href="{{dashboard_link}}" style="background-color: #F59E0B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Renew Now</a></p>
</div>`,
        variables: ['{{name}}', '{{days}}', '{{dashboard_link}}']
    },
    {
        key: 'subscription_ended',
        name: 'Subscription Ended',
        subject: 'Your WaMate Subscription Has Expired',
        body: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
    <h2 style="color: #EF4444;">Service Suspended</h2>
    <p>Hi {{name}},</p>
    <p>Your subscription with WaMate has expired today.</p>
    <p>Your instances may be paused until you renew your subscription.</p>
    <p><a href="{{dashboard_link}}" style="background-color: #EF4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reactivate Subscription</a></p>
</div>`,
        variables: ['{{name}}', '{{dashboard_link}}']
    },
    {
        key: 'password_reset',
        name: 'Password Reset',
        subject: 'Password Reset Request - WaMate',
        body: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
    <h2 style="color: #4F46E5;">Password Reset Request</h2>
    <p>Hi {{name}},</p>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    <p><a href="{{reset_link}}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
    <p>Or use this reset code: <strong>{{code}}</strong></p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, you can ignore this email.</p>
</div>`,
        variables: ['{{name}}', '{{reset_link}}', '{{code}}']
    }
];

async function seedTemplates() {
    console.log('🌱 Seeding Email Templates...');
    for (const tmpl of DEFAULT_TEMPLATES) {
        const [template, created] = await EmailTemplate.findOrCreate({
            where: { key: tmpl.key },
            defaults: tmpl
        });
        if (created) console.log(`   ✅ Created template: ${tmpl.key}`);
    }
    console.log('✅ Template seeding complete.');
}

module.exports = seedTemplates;
