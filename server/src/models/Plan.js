const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Plan = sequelize.define('Plan', {
    id: {
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    monthly_message_limit: {
        type: DataTypes.INTEGER,
        defaultValue: 1000
    },
    max_instances: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    max_seats: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    billing_cycle: {
        type: DataTypes.ENUM('monthly', 'quarterly', 'yearly', 'lifetime'),
        defaultValue: 'monthly'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    // AI Integration Fields
    ai_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    ai_reply_limit: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    ai_knowledge_limit: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    ai_model_id: {
        type: DataTypes.STRING,
        defaultValue: 'gemini-3-flash'
    }
}, {
    timestamps: true,
    tableName: 'plans'
});

module.exports = Plan;
