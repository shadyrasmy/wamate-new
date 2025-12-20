const { sequelize, EmailTemplate } = require('../src/models');

const templates = [
    {
        key: 'verification',
        name: 'Email Verification',
        subject: 'Verify your WaMate account',
        body: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4ade80;">Welcome to WaMate!</h2>
                <p>Hello {{name}},</p>
                <p>Please verify your email address to activate your account and start using our WhatsApp automation tools.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{{link}}" style="background: #4ade80; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
                </div>
                <p style="font-size: 12px; color: #666;">If you didn't create an account, you can safely ignore this email.</p>
            </div>
        `,
        variables: ['{{name}}', '{{link}}']
    },
    {
        key: 'welcome',
        name: 'Welcome Email',
        subject: 'Your WaMate Journey Starts Now 🚀',
        body: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4ade80;">You're In!</h2>
                <p>Hello {{name}},</p>
                <p>Your account is now verified and ready. You can start creating your first WhatsApp Instance and automating your messaging.</p>
                <p>Need help? Our support team is always available.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{{dashboard_link}}" style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
                </div>
            </div>
        `,
        variables: ['{{name}}', '{{dashboard_link}}']
    },
    {
        key: 'subscription_purchase',
        name: 'Subscription Purchase',
        subject: 'Your WaMate Subscription is Active',
        body: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4ade80;">Payment Confirmed</h2>
                <p>Thank you for choosing WaMate, {{name}}!</p>
                <p>Your <b>{{plan_name}}</b> plan is now active. Your subscription is valid until {{end_date}}.</p>
                <p>Check your dashboard for invoice details.</p>
            </div>
        `,
        variables: ['{{name}}', '{{plan_name}}', '{{end_date}}']
    },
    {
        key: 'subscription_expiry_warning',
        name: 'Subscription Expiry Warning',
        subject: 'Action Required: Your WaMate Subscription Expires Soon',
        body: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #f87171;">Subscription Warning</h2>
                <p>Hi {{name}},</p>
                <p>Your {{plan_name}} subscription will expire in {{days_left}} days on {{end_date}}.</p>
                <p>Renew now to avoid any interruption in your automated messaging flows.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{{renewal_link}}" style="background: #f87171; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Renew Subscription</a>
                </div>
            </div>
        `,
        variables: ['{{name}}', '{{plan_name}}', '{{days_left}}', '{{end_date}}', '{{renewal_link}}']
    },
    {
        key: 'subscription_expired',
        name: 'Subscription Expired',
        subject: 'Your WaMate Subscription has Expired',
        body: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #999;">Subscription Expired</h2>
                <p>Hi {{name}},</p>
                <p>Your subscription has expired, and your automated nodes have been paused.</p>
                <p>Reactivate your account now to resume messaging.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{{renewal_link}}" style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reactivate Now</a>
                </div>
            </div>
        `,
        variables: ['{{name}}', '{{renewal_link}}']
    }
];

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        for (const t of templates) {
            const [template, created] = await EmailTemplate.findOrCreate({
                where: { key: t.key },
                defaults: t
            });
            if (created) {
                console.log(`✅ Created template: ${t.key}`);
            } else {
                console.log(`ℹ️ Template already exists: ${t.key}`);
            }
        }

        console.log('\nAll templates seeded successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding templates:', error);
        process.exit(1);
    }
};

seed();
