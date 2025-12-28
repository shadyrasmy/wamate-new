const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'wamate_new',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 20, // Reduced to prevent hitting 'max_user_connections' limits in dev/shared hosting
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const connectDB = async () => {
    // Skip DB entirely if SKIP_DB is set (useful when connection limits are reached)
    if (process.env.SKIP_DB === 'true') {
        console.log('⏭️  Skipping database connection (SKIP_DB=true)');
        return;
    }

    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');

        // Ensure models are loaded before sync
        require('../models');

        // Only sync models if explicitly enabled (to avoid excessive DB connections)
        // Set SYNC_DB=true when you need to update schema
        if (process.env.SYNC_DB === 'true') {
            await sequelize.sync({ alter: true });
            console.log('✅ Models synced');
        } else {
            console.log('⏭️  Skipping model sync (set SYNC_DB=true to enable)');
        }

        // Seed default plans if empty
        const Plan = require('../models/Plan');
        const count = await Plan.count();
        if (count === 0) {
            await Plan.bulkCreate([
                { name: 'free', price: 0, monthly_message_limit: 1000, max_instances: 1, max_seats: 1, description: 'Connectivity for individuals.' },
                { name: 'pro', price: 49.99, monthly_message_limit: 10000, max_instances: 5, max_seats: 5, description: 'Growth tier for small teams.' },
                { name: 'enterprise', price: 199.99, monthly_message_limit: 100000, max_instances: 20, max_seats: 20, description: 'Global scale operations.' }
            ]);
            console.log('✅ Default plans seeded');
        }
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        // Don't exit process, just log error, maybe DB isn't ready
    }
};

module.exports = { sequelize, connectDB };
