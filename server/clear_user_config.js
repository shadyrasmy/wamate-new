const { Sequelize } = require('sequelize');
const path = require('path');
const { User, WhatsAppInstance } = require('./src/models');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function clearUserConfig() {
    try {
        console.log('--- Clearing User AI Config ---');

        // Instance ID: b5bf55d5-da75-4322-ad2c-9cf97b80ecc5
        const instanceId = 'b5bf55d5-da75-4322-ad2c-9cf97b80ecc5';
        const instance = await WhatsAppInstance.findOne({ where: { instance_id: instanceId } });

        if (!instance) {
            console.log(`Instance ${instanceId} not found.`);
            return;
        }

        const user = await User.findByPk(instance.user_id);
        if (user) {
            console.log(`Found User ${user.id} with ai_model_id: ${user.ai_model_id}`);
            if (user.ai_model_id) {
                user.ai_model_id = null;
                await user.save();
                console.log('✅ Successfully CLEARED user.ai_model_id.');
            } else {
                console.log('User ai_model_id is already clean.');
            }
        } else {
            console.log('User not found.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

clearUserConfig();
