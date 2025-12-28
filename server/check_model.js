const { Sequelize } = require('sequelize');
const path = require('path');
const { User, WhatsAppInstance, SiteConfig, Plan } = require('./src/models');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function checkConfig() {
    try {
        console.log('--- checking configuration ---');

        // 1. Global Site Config
        const config = await SiteConfig.findOne();
        console.log('Global SiteConfig.ai_settings:', JSON.stringify(config?.ai_settings, null, 2));

        // 2. Find the instance from the logs
        // Instance ID: b5bf55d5-da75-4322-ad2c-9cf97b80ecc5
        const instanceId = 'b5bf55d5-da75-4322-ad2c-9cf97b80ecc5';
        const instance = await WhatsAppInstance.findOne({ where: { instance_id: instanceId } });

        if (!instance) {
            console.log(`Instance ${instanceId} not found.`);
            return;
        }

        // 3. Find User and Plan
        const user = await User.findByPk(instance.user_id, { include: ['plan'] });

        console.log('User ID:', user.id);
        console.log('User.ai_model_id:', user.ai_model_id);
        console.log('User Plan:', user.plan?.name);
        console.log('Plan.ai_model_id:', user.plan?.ai_model_id);

        console.log('--- logic trace ---');
        const globalDefault = config?.ai_settings?.default_model || 'gemini-2.5-flash-lite';
        const selectedModel = user.ai_model_id || user.plan?.ai_model_id || globalDefault;
        console.log('Resolved Global Default:', globalDefault);
        console.log('FINAL SELECTED MODEL:', selectedModel);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

checkConfig();
