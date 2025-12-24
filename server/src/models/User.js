const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    access_token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user'
    },
    id_plan: {
        type: DataTypes.STRING(36),
        allowNull: true,
        references: {
            model: 'plans',
            key: 'id'
        }
    },
    max_instances: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    max_seats: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    // Subscription Fields
    monthly_message_limit: {
        type: DataTypes.INTEGER,
        defaultValue: 100 // Free tier default
    },
    messages_sent_current_period: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    subscription_start_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    subscription_end_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    last_expiry_warning_sent: {
        type: DataTypes.DATE,
        allowNull: true
    },
    notifications_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    // Referral System Fields
    referral_code: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true // Can be null if not generated yet, but usually generated on msg
    },
    referred_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    referral_balance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true // Optional for existing users, mandatory for new
    },
    email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    verification_token: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'users'
});

module.exports = User;

